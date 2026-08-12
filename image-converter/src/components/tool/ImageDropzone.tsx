"use client";

import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { imageLimits } from "@/config/site";
import { Button } from "@/components/common/Button";

export function ImageDropzone({
  onFiles,
  maxFiles = imageLimits.maxFiles,
  disabled = false,
}: {
  onFiles: (files: FileList | File[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`image-dropzone${dragging ? " is-dragging" : ""}${disabled ? " is-disabled" : ""}`}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (disabled) return;
        if (event.dataTransfer.files?.length) {
          onFiles(event.dataTransfer.files);
        }
      }}
    >
      <ImagePlus size={28} strokeWidth={1.75} aria-hidden="true" />
      <p className="image-dropzone__title">
        {maxFiles === 1 ? "Drop an image here" : `Drop up to ${maxFiles} images here`}
      </p>
      <p className="image-dropzone__hint">
        or{" "}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose {maxFiles === 1 ? "Image" : "Images"}
        </Button>
      </p>
      <p className="image-dropzone__meta">
        JPG, JPEG, PNG, WebP · under 5 MB each
        {maxFiles > 1 ? ` · max ${maxFiles} images` : ""}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={imageLimits.acceptAttribute}
        multiple={maxFiles > 1}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          if (event.target.files?.length) {
            onFiles(event.target.files);
            event.target.value = "";
          }
        }}
      />
    </div>
  );
}
