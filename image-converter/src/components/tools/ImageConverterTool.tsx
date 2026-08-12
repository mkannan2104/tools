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
import type { OutputImageFormat } from "@/types/tool";

interface ConvertResult {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  size: number;
}

export function ImageConverterTool() {
  const { images, errors, setErrors, addFiles, removeImage, clearImages } =
    useImageSelection();
  const [outputFormat, setOutputFormat] =
    useState<OutputImageFormat>("image/jpeg");
  const [results, setResults] = useState<ConvertResult[]>([]);
  const [busy, setBusy] = useState(false);
  const resultsDataRef = useRef<ConvertResult[]>([]);
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
    for (const result of results) URL.revokeObjectURL(result.previewUrl);
    setResults([]);
  };

  const convertAll = async () => {
    if (images.length === 0) return;
    requestScroll();
    setBusy(true);
    setErrors([]);
    clearResults();
    try {
      const next: ConvertResult[] = [];
      for (const image of images) {
        const encoded = await encodeImage(image.file, {
          mimeType: outputFormat,
          quality: 0.92,
        });
        next.push({
          id: image.id,
          name: encoded.filename,
          blob: encoded.blob,
          previewUrl: URL.createObjectURL(encoded.blob),
          size: encoded.blob.size,
        });
      }
      setResults(next);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Conversion failed.",
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
                  <p>{formatBytes(image.size)}</p>
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
            ))}
          </div>

          <fieldset className="format-fieldset">
            <legend>Output format</legend>
            {(
              [
                ["image/jpeg", "JPG"],
                ["image/png", "PNG"],
                ["image/webp", "WebP"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="radio-row">
                <input
                  type="radio"
                  name="output-format"
                  value={value}
                  checked={outputFormat === value}
                  onChange={() => setOutputFormat(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>

          <div className="actions">
            <Button
              type="button"
              variant="primary"
              onClick={convertAll}
              disabled={busy}
            >
              {busy ? "Converting…" : "Convert"}
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
                  <p>{formatBytes(result.size)}</p>
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
        Conversion supports JPG, PNG, and WebP only. Processing stays in your
        browser.
      </p>
    </div>
  );
}
