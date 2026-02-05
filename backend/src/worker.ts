import { Worker } from "bullmq";
import { connection } from "./redis";
import { getImageEmbedding } from "./ai/vertexEmbbeding";
import { cosineSimilarity } from "./ai/similarity";
import { LostFoundModel } from "./models/LostFoundModel";

const threshold = 0.5;
new Worker(
  "jobs",
  async (job) => {
    if (job.name === "process-create-post") {
      const { candidate, uploadingImage, response } = job.data;

      if (!candidate.image) return null;
      const candEmbedding = await getImageEmbedding(candidate.image);
      const similarity = cosineSimilarity(uploadingImage, candEmbedding); // 0 → 1
      if (similarity < threshold) return null;

      await LostFoundModel.findOneAndUpdate(
        { _id: response._id },
        {
          $push: {
            matches: {
              postId: String(candidate._id),
              score: Math.round(similarity * 100),
            },
          },
        },
      );
    }
  },
  {
    connection,
    concurrency: 5,
  },
);

console.log("Worker working");
