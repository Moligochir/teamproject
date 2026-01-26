"use client";

import { pipeline } from "@xenova/transformers";

let extractor: any;

export async function getImageEmbeddingFromFile(file: File) {
  if (!extractor) {
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/clip-vit-base-patch32",
      { quantized: true },
    );
  }

  const buffer = await file.arrayBuffer();

  const embedding = await extractor(new Uint8Array(buffer), {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(embedding.data);
}
