import { NextResponse } from "next/server";
import LostReport from "@/models/LostReport";
import { getEmbedding } from "@/lib/ai";
import { findSimilarPets } from "@/lib/vectorSearch";

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get("image") as File;

  // 1. save image locally / cloud
  const imagePath = "/tmp/pet.jpg";

  // 2. get CLIP embedding
  const embedding = await getEmbedding(imagePath);

  // 3. save lost report
  const lost = await LostReport.create({
    embedding,
    imageUrl: "/uploads/pet.jpg"
  });

  // 4. vector search
  const matches = await findSimilarPets(embedding);

  return NextResponse.json({
    lost,
    matches
  });
}
