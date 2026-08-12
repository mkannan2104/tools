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
import { encodeImage } from "@/services/image/process";
import { formatBytes } from "@/services/image/validate";
import type { OutputImageFormat, SelectedImage } from "@/types/tool";

interface ResizeResult {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
}

type Mode = "dimensions" | "percent";

function defaultsFor(image: SelectedImage) {
  return {
    width: image.width,
    height: image.height,
    percent: 100,
    lockAspect: true,
  };
}

export function ImageResizerTool() {
  const { images, errors, setErrors, addFiles, removeImage, clearImages } =
    useImageSelection();
  const [mode, setMode] = useState<Mode>("dimensions");
  const [outputFormat, setOutputFormat] =
    useState<OutputImageFormat>("image/jpeg");
  const [settings, setSettings] = useState<
    Record<
      string,
      { width: number; height: number; percent: number; lockAspect: boolean }
    >
  >({});
  const [results, setResults] = useState<ResizeResult[]>([]);
  const [busy, setBusy] = useState(false);
  const resultsDataRef = useRef<ResizeResult[]>([]);
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

  const settingFor = (image: SelectedImage) =>
    settings[image.id] ?? defaultsFor(image);

  const clearResults = () => {
    for (const result of results) URL.revokeObjectURL(result.previewUrl);
    setResults([]);
  };

  const updateSetting = (
    image: SelectedImage,
    patch: Partial<{
      width: number;
      height: number;
      percent: number;
      lockAspect: boolean;
    }>,
  ) => {
    setSettings((prev) => {
      const current = prev[image.id] ?? defaultsFor(image);
      const next = { ...current, ...patch };
      if (next.lockAspect && patch.width != null) {
        next.height = Math.max(
          1,
          Math.round((patch.width / image.width) * image.height),
        );
      }
      if (next.lockAspect && patch.height != null && patch.width == null) {
        next.width = Math.max(
          1,
          Math.round((patch.height / image.height) * image.width),
        );
      }
      return { ...prev, [image.id]: next };
    });
  };

  const resizeAll = async () => {
    if (images.length === 0) return;
    requestScroll();
    setBusy(true);
    setErrors([]);
    clearResults();
    try {
      const next: ResizeResult[] = [];
      for (const image of images) {
        const setting = settingFor(image);
                let width = setting.width;
                let height = setting.height;
        if (mode === "percent") {
          const scale = setting.percent / 100;
          width = Math.max(1, Math.round(image.width * scale));
          height = Math.max(1, Math.round(image.height * scale));
        }
        const encoded = await encodeImage(image.file, {
          mimeType: outputFormat,
          quality: 0.92,
          width,
          height,
        });
        next.push({
          id: image.id,
          name: encoded.filename,
          blob: encoded.blob,
          previewUrl: URL.createObjectURL(encoded.blob),
          width: encoded.width,
          height: encoded.height,
          size: encoded.blob.size,
        });
      }
      setResults(next);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Resize failed.",
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
            <div className="actions">
              <label className="field-inline">
                <span>Mode</span>
                <select
                  value={mode}
                  onChange={(event) => setMode(event.target.value as Mode)}
                >
                  <option value="dimensions">Width / Height</option>
                  <option value="percent">Percentage</option>
                </select>
              </label>
              <label className="field-inline">
                <span>Output</span>
                <select
                  value={outputFormat}
                  onChange={(event) =>
                    setOutputFormat(event.target.value as OutputImageFormat)
                  }
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </label>
              <Button type="button" onClick={clearImages} disabled={busy}>
                Clear
              </Button>
            </div>
          </div>

          <div className="image-card-grid">
            {images.map((image) => {
              const setting = settingFor(image);
              return (
                <article key={image.id} className="image-card image-card--wide">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.previewUrl}
                    alt=""
                    className="image-card__preview"
                  />
                  <div className="image-card__body">
                    <h3 title={image.name}>{image.name}</h3>
                    <p>
                      Original: {image.width} × {image.height} ·{" "}
                      {formatBytes(image.size)}
                    </p>

                    {mode === "dimensions" ? (
                      <>
                        <label className="field-stack">
                          <span>Width</span>
                          <input
                            type="number"
                            min={1}
                            value={setting.width}
                            onChange={(event) =>
                              updateSetting(image, {
                                width: Number(event.target.value) || 1,
                              })
                            }
                          />
                        </label>
                        <label className="field-stack">
                          <span>Height</span>
                          <input
                            type="number"
                            min={1}
                            value={setting.height}
                            onChange={(event) =>
                              updateSetting(image, {
                                height: Number(event.target.value) || 1,
                              })
                            }
                          />
                        </label>
                        <label className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={setting.lockAspect}
                            onChange={(event) =>
                              updateSetting(image, {
                                lockAspect: event.target.checked,
                              })
                            }
                          />
                          Maintain aspect ratio
                        </label>
                      </>
                    ) : (
                      <label className="field-stack">
                        <span>Percentage {setting.percent}%</span>
                        <input
                          type="range"
                          min={1}
                          max={200}
                          value={setting.percent}
                          onChange={(event) =>
                            updateSetting(image, {
                              percent: Number(event.target.value),
                            })
                          }
                        />
                      </label>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      onClick={() => removeImage(image.id)}
                      disabled={busy}
                    >
                      Remove
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="actions">
            <Button
              type="button"
              variant="primary"
              onClick={resizeAll}
              disabled={busy}
            >
              {busy ? "Resizing…" : "Resize"}
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
            {results.map((result) => (
              <article key={result.id} className="image-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.previewUrl}
                  alt=""
                  className="image-card__preview"
                />
                <div className="image-card__body">
                  <h3 title={result.name}>{result.name}</h3>
                  <p>
                    {result.width} × {result.height} · {formatBytes(result.size)}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => downloadBlob(result.blob, result.name)}
                  >
                    Download
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <p className="privacy-note">
        Resize runs locally with browser canvas APIs. Your files are not
        uploaded.
      </p>
    </div>
  );
}
