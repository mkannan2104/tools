export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function downloadBlobsSequentially(
  items: { blob: Blob; filename: string }[],
  delayMs = 200,
): Promise<void> {
  for (let i = 0; i < items.length; i += 1) {
    downloadBlob(items[i].blob, items[i].filename);
    if (i < items.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
