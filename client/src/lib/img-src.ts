type ImageImport = string | { src: string; height?: number; width?: number };

export function imgSrc(img: ImageImport): string {
  if (typeof img === "string") return img;
  if (img && typeof img === "object" && "src" in img) return img.src;
  return String(img);
}
