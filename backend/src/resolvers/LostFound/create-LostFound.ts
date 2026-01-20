import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";
import { sendPostNotification } from "../../server";
import { getImageEmbeddingFromURL } from "./embedding";
import { cosineSimilarity } from "./cosine";

export const createLostFound = async (req: Request, res: Response) => {
  const newLostFound = req.body;

  try {
    const send = await sendPostNotification(
      newLostFound.name,
      newLostFound.description,
    );
    if (send) {
      console.log("Admin notified!");
    } else {
      console.log("Failed to send email");
    }
    // const response = await openai.embeddings.create({
    //   model: "text-embedding-3-large",
    //   input: newLostFound.image, // URL шууд өгч болно
    // });
    // const embedding = response.data[0].embedding;
    const embedding = await getImageEmbeddingFromURL(newLostFound.image);
    console.log("embedding length:", embedding.length);
    const posts = await LostFoundModel.find({ embedding: { $exists: true } });
    const matches = posts
      .filter((p) => Array.isArray(p.embedding) && p.embedding.length > 0)
      .map((p) => ({
        postId: p._id,
        image: p.image,
        score: cosineSimilarity(embedding, p.embedding as number[]),
      }))
      .filter((m) => m.score > 0.8)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    await LostFoundModel.create({
      role: newLostFound.role,
      petType: newLostFound.petType,
      name: newLostFound.name,
      breed: newLostFound.breed,
      location: newLostFound.location,
      lat: newLostFound.lat,
      lng: newLostFound.lng,
      description: newLostFound.description,
      image: newLostFound.image,
      userId: newLostFound.userId,
      gender: newLostFound.gender,
      Date: newLostFound.Date,
      phonenumber: newLostFound.phonenumber,
      matchedPosts: matches,
      embedding: embedding,
    });

    res.status(200).json({ success: true, matches: matches });
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
