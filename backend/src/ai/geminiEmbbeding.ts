// ❌ ЭНИЙГ УСТГА: import fetch from "node-fetch";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getImageEmbedding(imageUrl: string): Promise<number[]> {
  const res = await fetch(imageUrl); // ✅ built-in fetch
  const buffer = Buffer.from(await res.arrayBuffer());
  const base64 = buffer.toString("base64");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "models/embedding-001" });

  const result = await model.embedContent({
    content: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64,
          },
        },
      ],
    },
  } as any);

  return result.embedding.values as number[];
}
