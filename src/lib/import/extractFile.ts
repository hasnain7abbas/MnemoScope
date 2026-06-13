import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { MemoryType, NewMemory } from "../memory/types";

const textExtensions = new Set([
  "txt",
  "md",
  "js",
  "ts",
  "tsx",
  "py",
  "rs",
  "cpp",
  "java",
  "css",
  "html",
  "json",
]);

const codeExtensions = new Set([
  "js",
  "ts",
  "tsx",
  "py",
  "rs",
  "cpp",
  "java",
  "css",
  "html",
  "json",
]);

function extensionOf(file: File) {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

async function readPdf(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const document = await pdfjs.getDocument({ data: bytes }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .filter((item) => "str" in item)
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
    );
  }

  return pages.join("\n\n");
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export async function extractFile(file: File): Promise<NewMemory> {
  const extension = extensionOf(file);
  const capturedAt = new Date(file.lastModified || Date.now()).toISOString();
  let memoryType: MemoryType = "file";
  let content = `Imported file: ${file.name}`;
  let imageDataUrl: string | undefined;

  if (file.type.startsWith("image/")) {
    memoryType = "image";
    imageDataUrl = await readAsDataUrl(file);
    content = `Image imported from ${file.name}.`;
  } else if (extension === "pdf" || file.type === "application/pdf") {
    memoryType = "pdf";
    content = await readPdf(file);
  } else if (textExtensions.has(extension) || file.type.startsWith("text/")) {
    memoryType = codeExtensions.has(extension) ? "code" : "file";
    content = await file.text();
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return {
    title: baseName || file.name,
    memoryType,
    content,
    summary: "",
    sourcePath: file.name,
    thumbnailPath: null,
    capturedAt,
    metadataJson: JSON.stringify({
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || "application/octet-stream",
      imageDataUrl,
      originalType: extension,
    }),
    tags: ["imported"],
  };
}
