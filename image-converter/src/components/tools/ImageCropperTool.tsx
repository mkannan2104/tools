"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Button } from "@/components/common/Button";
import { ImageDropzone } from "@/components/tool/ImageDropzone";
import { useImageSelection } from "@/lib/useImageSelection";
import { useScrollToResults } from "@/lib/useScrollToResults";
import { downloadBlob } from "@/services/browser/download";
import { cropImage, mimeFromFile } from "@/services/image/process";
import { formatBytes } from "@/services/image/validate";

type AspectPreset = "free" | "1:1" | "4:3" | "16:9";

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

function ratioValue(preset: AspectPreset): number | null {
  if (preset === "1:1") return 1;
  if (preset === "4:3") return 4 / 3;
  if (preset === "16:9") return 16 / 9;
  return null;
}

function initialCrop(width: number, height: number, preset: AspectPreset): CropBox {
  const ratio = ratioValue(preset);
  if (!ratio) {
    const size = Math.min(width, height) * 0.8;
    return {
      x: (width - size) / 2,
      y: (height - size) / 2,
      width: size,
      height: size,
    };
  }

  let cropW = width * 0.8;
  let cropH = cropW / ratio;
  if (cropH > height * 0.8) {
    cropH = height * 0.8;
    cropW = cropH * ratio;
  }
  return {
    x: (width - cropW) / 2,
    y: (height - cropH) / 2,
    width: cropW,
    height: cropH,
  };
}

function clampCrop(box: CropBox, width: number, height: number): CropBox {
  const w = Math.min(Math.max(20, box.width), width);
  const h = Math.min(Math.max(20, box.height), height);
  const x = Math.min(Math.max(0, box.x), width - w);
  const y = Math.min(Math.max(0, box.y), height - h);
  return { x, y, width: w, height: h };
}

export function ImageCropperTool() {
  const { images, errors, setErrors, replaceWithSingle, clearImages } =
    useImageSelection({ maxFiles: 1 });
  const image = images[0] ?? null;
  const [preset, setPreset] = useState<AspectPreset>("free");
  const [crop, setCrop] = useState<CropBox | null>(null);
  const [boundKey, setBoundKey] = useState<string | null>(null);
  const [result, setResult] = useState<{
    blob: Blob;
    previewUrl: string;
    name: string;
    width: number;
    height: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    mode: "move" | "resize";
    startX: number;
    startY: number;
    origin: CropBox;
  } | null>(null);
  const { resultsRef, requestScroll } = useScrollToResults(Boolean(result));

  const key = image ? `${image.id}:${preset}` : null;
  if (key !== boundKey) {
    setBoundKey(key);
    setCrop(image ? initialCrop(image.width, image.height, preset) : null);
    setResult((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  }

  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    return () => {
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.previewUrl);
        return null;
      });
    };
  }, []);

  useEffect(() => {
    if (!image || !stageRef.current) return;
    const el = stageRef.current;
    const update = () => {
      const maxW = Math.max(200, el.clientWidth - 8);
      const maxH = Math.min(420, Math.round(window.innerHeight * 0.48));
      const scale = Math.min(1, maxW / image.width, maxH / image.height);
      setStageSize({
        width: Math.max(1, Math.round(image.width * scale)),
        height: Math.max(1, Math.round(image.height * scale)),
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [image]);

  const scale =
    image && stageSize.width > 0 ? stageSize.width / image.width : 1;

  const onPointerDown = (
    event: ReactPointerEvent,
    mode: "move" | "resize",
  ) => {
    if (!crop) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      origin: crop,
    };
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    if (!dragRef.current || !image || !crop) return;
    const dx = (event.clientX - dragRef.current.startX) / scale;
    const dy = (event.clientY - dragRef.current.startY) / scale;
    const origin = dragRef.current.origin;
    const ratio = ratioValue(preset);

    if (dragRef.current.mode === "move") {
      setCrop(
        clampCrop(
          {
            ...origin,
            x: origin.x + dx,
            y: origin.y + dy,
          },
          image.width,
          image.height,
        ),
      );
      return;
    }

    const width = origin.width + dx;
    let height = origin.height + dy;
    if (ratio) {
      height = width / ratio;
    }
    setCrop(
      clampCrop(
        { x: origin.x, y: origin.y, width, height },
        image.width,
        image.height,
      ),
    );
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const runCrop = async () => {
    if (!image || !crop) return;
    requestScroll();
    setBusy(true);
    setErrors([]);
    try {
      const encoded = await cropImage(
        image.file,
        crop,
        mimeFromFile(image.file),
        0.92,
      );
      const previewUrl = URL.createObjectURL(encoded.blob);
      setResult((prev) => {
        if (prev) URL.revokeObjectURL(prev.previewUrl);
        return {
          blob: encoded.blob,
          previewUrl,
          name: encoded.filename,
          width: encoded.width,
          height: encoded.height,
        };
      });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Crop failed."]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-tool">
      <ImageDropzone
        onFiles={replaceWithSingle}
        maxFiles={1}
        disabled={busy}
      />

      {errors.length > 0 ? (
        <div className="tool-error" role="alert">
          <strong>Could not process image</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {image && crop ? (
        <section className="image-section">
          <div className="image-section__header">
            <h2>
              {image.name} · {formatBytes(image.size)}
            </h2>
            <Button type="button" onClick={clearImages} disabled={busy}>
              Clear
            </Button>
          </div>

          <div className="aspect-row" role="group" aria-label="Aspect ratio">
            {(
              [
                ["free", "Free"],
                ["1:1", "1:1"],
                ["4:3", "4:3"],
                ["16:9", "16:9"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={preset === value ? "primary" : "secondary"}
                onClick={() => setPreset(value)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="crop-stage" ref={stageRef}>
            <div
              className="crop-stage__canvas"
              style={{ width: stageSize.width, height: stageSize.height }}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.previewUrl} alt="" draggable={false} />
              <div
                className="crop-box"
                style={{
                  left: crop.x * scale,
                  top: crop.y * scale,
                  width: crop.width * scale,
                  height: crop.height * scale,
                }}
                onPointerDown={(event) => onPointerDown(event, "move")}
              >
                <span
                  className="crop-handle"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    onPointerDown(event, "resize");
                  }}
                />
              </div>
            </div>
          </div>

          <div className="actions">
            <Button
              type="button"
              variant="primary"
              onClick={runCrop}
              disabled={busy}
            >
              {busy ? "Cropping…" : "Crop"}
            </Button>
          </div>
        </section>
      ) : null}

      {result ? (
        <section
          ref={resultsRef}
          className="image-section tool-results-anchor"
          tabIndex={-1}
        >
          <h2>Preview</h2>
          <div className="image-card-grid">
            <article className="image-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.previewUrl}
                alt=""
                className="image-card__preview"
              />
              <div className="image-card__body">
                <h3>{result.name}</h3>
                <p>
                  {result.width} × {result.height} ·{" "}
                  {formatBytes(result.blob.size)}
                </p>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => downloadBlob(result.blob, result.name)}
                >
                  Download
                </Button>
              </div>
            </article>
          </div>
        </section>
      ) : null}

      <p className="privacy-note">
        Basic cropping only — drag the box, pick a ratio, crop, and download.
        Processing stays local.
      </p>
    </div>
  );
}
