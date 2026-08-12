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
import {
  readMetadataHints,
  type MetadataHints,
} from "@/services/image/metadata";
import { encodeImage, mimeFromFile } from "@/services/image/process";
import { formatBytes } from "@/services/image/validate";

interface CleanResult {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  size: number;
}

export function ImageMetadataRemoverTool() {
  const { images, errors, setErrors, addFiles, removeImage, clearImages } =
    useImageSelection();
  const [hints, setHints] = useState<Record<string, MetadataHints>>({});
  const [results, setResults] = useState<CleanResult[]>([]);
  const [busy, setBusy] = useState(false);
  const resultsDataRef = useRef<CleanResult[]>([]);
  const { resultsRef, requestScroll } = useScrollToResults(results.length > 0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const next: Record<string, MetadataHints> = {};
      for (const image of images) {
        next[image.id] = await readMetadataHints(image.file);
      }
      if (!cancelled) setHints(next);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [images]);

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

  const removeMetadata = async () => {
    if (images.length === 0) return;
    requestScroll();
    setBusy(true);
    setErrors([]);
    clearResults();
    try {
      const next: CleanResult[] = [];
      for (const image of images) {
        const mimeType = mimeFromFile(image.file);
        const encoded = await encodeImage(image.file, {
          mimeType,
          quality: mimeType === "image/png" ? undefined : 0.92,
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
        error instanceof Error ? error.message : "Metadata removal failed.",
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
            {images.map((image) => {
              const hint = hints[image.id];
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
                    <p>{formatBytes(image.size)}</p>
                    <ul className="meta-list">
                      <li>Camera: {hint?.camera ?? "Not detected"}</li>
                      <li>Date: {hint?.date ?? "Not detected"}</li>
                      <li>GPS: {hint?.gps ?? "Unknown"}</li>
                    </ul>
                    {hint?.notes ? (
                      <p className="meta-note">{hint.notes}</p>
                    ) : null}
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
              onClick={removeMetadata}
              disabled={busy}
            >
              {busy ? "Working…" : "Remove Metadata"}
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
            <h2>Clean Images</h2>
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
              Download Clean Images
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
        Images are re-encoded locally to strip common metadata. This does not
        claim to remove every possible metadata field from every format.
      </p>
    </div>
  );
}
