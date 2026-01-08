import { db } from "./db";

export async function findSimilarPets(
  embedding: number[]
) {
  const results = await db.collection("foundreports")
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embedding,
          numCandidates: 100,
          limit: 5
        }
      },
      {
        $project: {
          score: { $meta: "vectorSearchScore" },
          imageUrl: 1
        }
      }
    ])
    .toArray();

  return results;
}
