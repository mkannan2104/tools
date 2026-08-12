"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { imageLimits } from "@/config/site";
import {
  filesToSelectedImages,
  revokeSelectedImages,
  validateImageFiles,
} from "@/services/image/validate";
import type { SelectedImage } from "@/types/tool";

export function useImageSelection(options?: { maxFiles?: number }) {
  const maxFiles = options?.maxFiles ?? imageLimits.maxFiles;
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const imagesRef = useRef<SelectedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      revokeSelectedImages(imagesRef.current);
    };
  }, []);

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      const { accepted, errors: nextErrors } = validateImageFiles(
        incoming,
        imagesRef.current.length,
        { maxFiles },
      );
      setErrors(nextErrors);

      if (accepted.length === 0) return;

      try {
        const selected = await filesToSelectedImages(accepted);
        setImages((prev) => [...prev, ...selected].slice(0, maxFiles));
      } catch (error) {
        setErrors([
          error instanceof Error ? error.message : "Failed to read images.",
        ]);
      }
    },
    [maxFiles],
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const clearImages = useCallback(() => {
    revokeSelectedImages(imagesRef.current);
    setImages([]);
    setErrors([]);
  }, []);

  const replaceWithSingle = useCallback(async (fileList: FileList | File[]) => {
    revokeSelectedImages(imagesRef.current);
    setImages([]);
    const incoming = Array.from(fileList).slice(0, 1);
    const { accepted, errors: nextErrors } = validateImageFiles(incoming, 0, {
      maxFiles: 1,
    });
    setErrors(nextErrors);
    if (accepted.length === 0) return;
    try {
      const selected = await filesToSelectedImages(accepted);
      setImages(selected);
    } catch (error) {
      setErrors([
        error instanceof Error ? error.message : "Failed to read image.",
      ]);
    }
  }, []);

  return {
    images,
    errors,
    setErrors,
    addFiles,
    removeImage,
    clearImages,
    replaceWithSingle,
    maxFiles,
  };
}
