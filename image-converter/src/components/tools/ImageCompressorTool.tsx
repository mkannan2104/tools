"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/common/Button";
import { ImageDropzone } from "@/components/tool/ImageDropzone";
import { useImageSelection } from "@/lib/useImageSelection";
import { useScrollToResults } from "@/lib/useScrollToResults";
import {
  downloadBlob,
  downloadBlobsSequentially,
} from "@/services/browser/download";
import { encodeImage, mimeFromFile } from "@/services/image/process";
import { formatBytes } from "@/services/image/validate";
import type { OutputImageFormat } from "@/types/tool";

interface CompressedResult {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  quality: number | null;
  formatLabel: string;
}

/** Lossy formats that actually honor the quality slider. */
type CompressFormat = "image/jpeg" | "image/webp";

function formatLabel(mime: OutputImageFormat): string {
  if (mime === "image/png") return "PNG";
  if (mime === "image/webp") return "WebP";
  return "JPG";
}

/**
 * PNG has no canvas quality knob — re-encoding often grows the file.
 * For "Auto", keep JPEG/WebP as-is and convert PNG → JPEG so 50% quality works.
 */
function resolveCompressMime(
  file: File,
  outputMode: "auto" | CompressFormat,
): OutputImageFormat {
  if (outputMode !== "auto") return outputMode;
  const source = mimeFromFile(file);
  if (source === "image/png") return "image/jpeg";
  return source;
}

export function ImageCompressorTool() {
  const { images, errors, setErrors, addFiles, removeImage, clearImages } =
    useImageSelection();
  const [quality, setQuality] = useState(80);
  const [outputMode, setOutputMode] = useState<"auto" | CompressFormat>("auto");
  const [results, setResults] = useState<CompressedResult[]>([]);
  const [busy, setBusy] = useState(false);
  const resultsDataRef = useRef<CompressedResult[]>([]);
  const { resultsRef, requestScroll } = useScrollToResults(results.length > 0);

  useEffect(() => {
    resultsDataRef.current = results;
  }, [results]);

  useEffect(() => {
    return () => {
      for (const result of resultsDataRef.current) {
        URL.revokeObjectURL(result.previewUrl);
      }
    };
  }, []);

  const clearResults = () => {
    for (const result of results) {
      URL.revokeObjectURL(result.previewUrl);
    }
    setResults([]);
  };

  const compressAll = async () => {
    if (images.length === 0) return;
    requestScroll();
    setBusy(true);
    setErrors([]);
    clearResults();
    try {
      const next: CompressedResult[] = [];
      const qualityValue = quality / 100;

      for (const image of images) {
        const mimeType = resolveCompressMime(image.file, outputMode);

        let encoded = await encodeImage(image.file, {
          mimeType,
          quality: qualityValue,
        });

        // If Auto still produced a larger file, try the other lossy format.
        if (
          outputMode === "auto" &&
          encoded.blob.size >= image.size
        ) {
          const fallbackMime: CompressFormat =
            mimeType === "image/webp" ? "image/jpeg" : "image/webp";
          const fallback = await encodeImage(image.file, {
            mimeType: fallbackMime,
            quality: qualityValue,
          });
          if (fallback.blob.size < encoded.blob.size) {
            encoded = fallback;
          }
        }

        next.push({
          id: image.id,
          name: encoded.filename,
          blob: encoded.blob,
          previewUrl: URL.createObjectURL(encoded.blob),
          originalSize: image.size,
          compressedSize: encoded.blob.size,
          quality: Math.round(qualityValue * 100),
          formatLabel: formatLabel(
            encoded.filename.toLowerCase().endsWith(".png")
              ? "image/png"
              : encoded.filename.toLowerCase().endsWith(".webp")
                ? "image/webp"
                : "image/jpeg",
          ),
        });
      }
      setResults(next);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Compression failed.",
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-tool">
      <ImageDropzone
        onFiles={addFiles}
        disabled={images.length >= 5 || busy}
      />

      {errors.length > 0 ? (
        <div className="tool-error" role="alert">
          <strong>Could not add some files</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {images.length > 0 ? (
        <section className="image-section">
          <div className="image-section__header">
            <h2>Selected Images</h2>
            <Button type="button" onClick={clearImages} disabled={busy}>
              Clear
            </Button>
          </div>

          <div className="compress-options">
            <label className="field-inline compress-options__quality">
              <span>Quality</span>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(Number(event.target.value))}
              />
              <strong>{quality}%</strong>
            </label>

            <fieldset className="format-fieldset compress-options__format">
              <legend>Output format</legend>
              {(
                [
                  ["auto", "Auto"],
                  ["image/jpeg", "JPG"],
                  ["image/webp", "WebP"],
                ] as const
              ).map(([value, label]) => (
                <label key={value} className="radio-row">
                  <input
                    type="radio"
                    name="compress-output"
                    value={value}
                    checked={outputMode === value}
                    onChange={() => setOutputMode(value)}
                  />
                  {label}
                </label>
              ))}
            </fieldset>

            <p className="compress-options__hint">
              Quality always applies via JPG or WebP. PNG sources are converted
              on Auto/JPG/WebP — keeping PNG often makes files larger because
              browsers cannot apply a quality setting to PNG.
            </p>
          </div>

          <div className="image-card-grid">
            {images.map((image) => (
              <article key={image.id} className="image-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.previewUrl}
                  alt=""
                  className="image-card__preview"
                />
                <div className="image-card__body">
                  <h3 title={image.name}>{image.name}</h3>
                  <p>
                    {formatBytes(image.size)} · {image.width}×{image.height}
                  </p>
                  <div className="image-card__actions">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      disabled={busy}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="actions">
            <Button
              type="button"
              variant="primary"
              onClick={compressAll}
              disabled={busy}
            >
              {busy ? "Compressing…" : "Compress All"}
            </Button>
          </div>
        </section>
      ) : null}

      {results.length > 0 ? (
        <section
          ref={resultsRef}
          className="image-section tool-results-anchor"
          tabIndex={-1}
        >
          <div className="image-section__header">
            <h2>Results</h2>
            <Button
              type="button"
              variant="primary"
              onClick={() =>
                downloadBlobsSequentially(
                  results.map((result) => ({
                    blob: result.blob,
                    filename: result.name,
                  })),
                )
              }
            >
              Download All
            </Button>
          </div>

          <div className="image-card-grid">
            {results.map((result) => {
              const saved = Math.max(
                0,
                Math.round(
                  ((result.originalSize - result.compressedSize) /
                    result.originalSize) *
                    100,
                ),
              );
              const grew = result.compressedSize > result.originalSize;
              return (
                <article key={result.id} className="image-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.previewUrl}
                    alt=""
                    className="image-card__preview"
                  />
                  <div className="image-card__body">
                    <h3 title={result.name}>{result.name}</h3>
                    <p>Original: {formatBytes(result.originalSize)}</p>
                    <p>Compressed: {formatBytes(result.compressedSize)}</p>
                    <p>
                      {result.formatLabel}
                      {result.quality != null
                        ? ` · Quality ${result.quality}%`
                        : ""}
                      {" · "}
                      {grew ? "Larger than original" : `Saved ${saved}%`}
                    </p>
                    <div className="image-card__actions">
                      <Button
                        type="button"
                        size="sm"
                        variant="primary"
                        onClick={() => downloadBlob(result.blob, result.name)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <p className="privacy-note">
        Images are processed locally in your browser. Nothing is uploaded for
        compression.
      </p>
    </div>
  );
}
