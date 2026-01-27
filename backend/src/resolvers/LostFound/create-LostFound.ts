import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";
import { sendPostNotification } from "../../server";
import { cosineSimilarity, toPercent } from "../../ai/similarity";

type Confidence = "HIGH" | "MEDIUM" | "LOW";

export const createLostFound = async (req: Request, res: Response) => {
  const newLostFound = req.body;

  try {
    // ✅ image URL шалгана
    if (typeof newLostFound?.image !== "string" || !newLostFound.image.trim()) {
      return res.status(400).json({
        success: false,
        message: "image must be a URL string (Cloudinary secure_url)",
      });
    }

    // ✅ embedding frontend-ээс ирэх ёстой
    const newEmbedding = newLostFound?.imageEmbedding;

    if (
      !Array.isArray(newEmbedding) ||
      newEmbedding.length === 0 ||
      typeof newEmbedding[0] !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "imageEmbedding (number[]) is required from frontend",
      });
    }

    // (optional) email
    try {
      const send = await sendPostNotification(
        newLostFound.name,
        newLostFound.description,
      );
      console.log(send ? "Admin notified!" : "Failed to send email");
    } catch (e) {
      console.log("Email error (ignored):", e);
    }

    const oppositeRole = newLostFound.role === "Lost" ? "Found" : "Lost";

    const candidates = await LostFoundModel.find({
      role: oppositeRole,
      petType: newLostFound.petType,
      imageEmbedding: { $exists: true, $type: "array", $ne: [] },
    })
      .select("_id name description image imageEmbedding")
      .lean();

    const THRESHOLD = 0.75;

    const matches = candidates
      .map((c: any) => {
        const emb = Array.isArray(c.imageEmbedding) ? c.imageEmbedding : [];
        if (emb.length === 0) return null;

        const sim01 = cosineSimilarity(newEmbedding, emb);
        if (sim01 < THRESHOLD) return null;

        const score = toPercent(sim01);

        const confidence: Confidence =
          score >= 90 ? "HIGH" : score >= 80 ? "MEDIUM" : "LOW";

        return {
          matchId: String(c._id),
          matchScore: score,
          confidence,
          image: c.image,
          name: c.name,
          description: c.description,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.matchScore - a.matchScore);

    const created = await LostFoundModel.create({
      ...newLostFound,
      imageEmbedding: newEmbedding, // ✅ frontend-ээс ирсэн embedding хадгална
      matches: matches.map((m) => ({ postId: m.matchId, score: m.matchScore })),
    });

    return res.status(200).json({
      success: true,
      postId: String(created._id),
      data: matches,
      dataLength: matches.length,
    });
  } catch (e: any) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e?.message || "Server error",
    });
  }
};
