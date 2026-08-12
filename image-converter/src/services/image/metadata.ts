/**
 * Lightweight JPEG EXIF hints for UI display only.
 * Not a full metadata parser — used to show Camera / Date / GPS availability.
 */

export interface MetadataHints {
  camera?: string;
  date?: string;
  gps: "Available" | "Not detected" | "Unknown";
  notes: string;
}

function readNullTerminatedAscii(
  view: DataView,
  offset: number,
  maxLen: number,
): string {
  const chars: string[] = [];
  for (let i = 0; i < maxLen; i += 1) {
    const code = view.getUint8(offset + i);
    if (code === 0) break;
    chars.push(String.fromCharCode(code));
  }
  return chars.join("").trim();
}

function parseJpegExif(buffer: ArrayBuffer): MetadataHints {
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) {
    return {
      gps: "Unknown",
      notes: "Not a JPEG — limited metadata preview.",
    };
  }

  let offset = 2;
  while (offset + 4 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    const size = view.getUint16(offset + 2);
    if (marker === 0xe1) {
      const start = offset + 4;
      const header = readNullTerminatedAscii(view, start, 6);
      if (header !== "Exif") {
        break;
      }
      return parseExifTiff(view, start + 6);
    }
    if (marker === 0xda) break;
    offset += 2 + size;
  }

  return {
    gps: "Not detected",
    notes: "No EXIF block found in this JPEG.",
  };
}

function parseExifTiff(view: DataView, tiffStart: number): MetadataHints {
  try {
    const endian = view.getUint16(tiffStart);
    const little = endian === 0x4949;
    const get16 = (o: number) => view.getUint16(o, little);
    const get32 = (o: number) => view.getUint32(o, little);

    const ifd0 = tiffStart + get32(tiffStart + 4);
    const { make, model, date, gpsOffset } = readIfd(view, ifd0, tiffStart, little, get16, get32);

    let gps: MetadataHints["gps"] = "Not detected";
    if (gpsOffset) {
      gps = "Available";
    }

    const camera = [make, model].filter(Boolean).join(" ").trim() || undefined;

    return {
      camera,
      date,
      gps,
      notes: "EXIF hints from JPEG. Re-encoding removes common embedded tags.",
    };
  } catch {
    return {
      gps: "Unknown",
      notes: "Could not parse EXIF for this file.",
    };
  }
}

function readIfd(
  view: DataView,
  ifdOffset: number,
  tiffStart: number,
  little: boolean,
  get16: (o: number) => number,
  get32: (o: number) => number,
): { make?: string; model?: string; date?: string; gpsOffset?: number } {
  const count = get16(ifdOffset);
  let make: string | undefined;
  let model: string | undefined;
  let date: string | undefined;
  let gpsOffset: number | undefined;

  for (let i = 0; i < count; i += 1) {
    const entry = ifdOffset + 2 + i * 12;
    const tag = get16(entry);
    const type = get16(entry + 2);
    const num = get32(entry + 4);
    const valueOffset = entry + 8;

    const readAscii = () => {
      const byteLen = type === 2 ? num : num;
      let dataOffset = valueOffset;
      if (byteLen > 4) dataOffset = tiffStart + get32(valueOffset);
      return readNullTerminatedAscii(view, dataOffset, Math.min(byteLen, 128));
    };

    if (tag === 0x010f) make = readAscii();
    if (tag === 0x0110) model = readAscii();
    if (tag === 0x0132 || tag === 0x9003) date = readAscii();
    if (tag === 0x8825) {
      gpsOffset = tiffStart + get32(valueOffset);
    }
  }

  return { make, model, date, gpsOffset };
}

export async function readMetadataHints(file: File): Promise<MetadataHints> {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const isJpeg =
    type === "image/jpeg" ||
    type === "image/jpg" ||
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg");

  if (isJpeg) {
    const buffer = await file.arrayBuffer();
    return parseJpegExif(buffer);
  }

  if (type === "image/png" || name.endsWith(".png")) {
    return {
      gps: "Unknown",
      notes:
        "PNG metadata is not fully inspected. Re-encoding still produces a fresh image without typical EXIF.",
    };
  }

  return {
    gps: "Unknown",
    notes:
      "WebP metadata is not fully inspected. Re-encoding still produces a fresh image without typical EXIF.",
  };
}
