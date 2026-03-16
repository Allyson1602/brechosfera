import { API_BASE_URL } from "@/lib/graphql/client";

interface UploadImageResponse {
  url: string;
  mimeType?: string;
  size?: number;
}

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_UPLOAD_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const TARGET_UPLOAD_FILE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_PROCESSABLE_IMAGE_SIZE_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2400;

export const ACCEPTED_IMAGE_INPUT = ".jpg,.jpeg,.png,image/jpeg,image/png";
export const INVALID_IMAGE_TYPE_MESSAGE = "Envie apenas arquivos JPG ou PNG.";
export const INVALID_IMAGE_SIZE_MESSAGE =
  "A imagem é muito grande para ser processada. Tente um arquivo menor.";

export function isAllowedImageFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.some((extension) =>
    fileName.endsWith(extension),
  );
  const hasAllowedMimeType = ALLOWED_IMAGE_MIME_TYPES.includes(file.type);

  return hasAllowedExtension && hasAllowedMimeType;
}

export function isAllowedImageSize(file: File): boolean {
  return file.size <= MAX_PROCESSABLE_IMAGE_SIZE_BYTES;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível processar a imagem selecionada."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Não foi possível preparar a imagem para envio."));
      },
      type,
      quality,
    );
  });
}

function replaceFileExtension(fileName: string, extension: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return `${fileName}${extension}`;
  return `${fileName.slice(0, lastDotIndex)}${extension}`;
}

async function optimizeImageForUpload(file: File): Promise<File> {
  if (
    file.size <= TARGET_UPLOAD_FILE_SIZE_BYTES &&
    typeof window !== "undefined"
  ) {
    const image = await loadImage(file);
    if (Math.max(image.width, image.height) <= MAX_IMAGE_DIMENSION) {
      return file;
    }
  }

  if (typeof window === "undefined") {
    return file;
  }

  const image = await loadImage(file);
  const baseScale = Math.min(
    1,
    MAX_IMAGE_DIMENSION / Math.max(image.width, image.height),
  );
  const scales = [
    baseScale,
    baseScale * 0.85,
    baseScale * 0.7,
    baseScale * 0.55,
  ].filter((scale, index, list) => scale > 0 && list.indexOf(scale) === index);

  const attempts: Array<{
    type: string;
    quality?: number;
    extension: string;
    fill: string | null;
  }> =
    file.type === "image/png"
      ? [
          { type: "image/png", extension: ".png", fill: null },
          {
            type: "image/jpeg",
            quality: 0.9,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.82,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.72,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.62,
            extension: ".jpg",
            fill: "#ffffff",
          },
        ]
      : [
          {
            type: "image/jpeg",
            quality: 0.9,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.82,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.72,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.62,
            extension: ".jpg",
            fill: "#ffffff",
          },
          {
            type: "image/jpeg",
            quality: 0.52,
            extension: ".jpg",
            fill: "#ffffff",
          },
        ];

  let bestCandidate: File | null = null;

  for (const scale of scales) {
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Não foi possível preparar a imagem para envio.");
    }

    for (const attempt of attempts) {
      context.clearRect(0, 0, width, height);
      if (attempt.fill) {
        context.fillStyle = attempt.fill;
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(image, 0, 0, width, height);

      const blob = await canvasToBlob(canvas, attempt.type, attempt.quality);
      const candidate = new File(
        [blob],
        replaceFileExtension(file.name, attempt.extension),
        { type: attempt.type, lastModified: Date.now() },
      );

      if (!bestCandidate || candidate.size < bestCandidate.size) {
        bestCandidate = candidate;
      }

      if (candidate.size <= TARGET_UPLOAD_FILE_SIZE_BYTES) {
        return candidate;
      }
    }
  }

  if (bestCandidate && bestCandidate.size <= MAX_UPLOAD_FILE_SIZE_BYTES) {
    return bestCandidate;
  }

  throw new Error(INVALID_IMAGE_SIZE_MESSAGE);
}

export async function uploadImageToBackend(file: File): Promise<string> {
  if (!isAllowedImageFile(file)) {
    throw new Error(INVALID_IMAGE_TYPE_MESSAGE);
  }

  if (!isAllowedImageSize(file)) {
    throw new Error(INVALID_IMAGE_SIZE_MESSAGE);
  }

  const processedFile = await optimizeImageForUpload(file);
  const formData = new FormData();
  formData.append("file", processedFile);

  const response = await fetch(`${API_BASE_URL}/uploads/image`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Falha ao enviar imagem para o backend.";

    try {
      const data = await response.json();
      if (data && typeof data.message === "string") {
        message = data.message;
      } else if (
        data &&
        Array.isArray(data.message) &&
        typeof data.message[0] === "string"
      ) {
        message = data.message[0];
      }
    } catch {
      // mantém mensagem padrão se a resposta não vier em JSON
    }

    throw new Error(message);
  }

  const data = (await response.json()) as UploadImageResponse;
  return data.url;
}
