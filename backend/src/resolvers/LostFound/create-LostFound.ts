import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";
import { sendPostNotification } from "../../server";
import { getImageEmbedding } from "../../ai/vertexEmbbeding";
import { cosineSimilarity } from "../../ai/similarity";
 
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
    // 1) Шинэ постын embedding
    const newEmbedding = await getImageEmbedding(newLostFound.image);
 
    // 2) DB дээрх эсрэг төрлийн post-уудыг авч харьцуулна
    //    (lost бол found-уудтай, found бол lost-уудтай)
    const oppositeRole = newLostFound.role === "Lost" ? "Found" : "Lost";
 
    const candidates = await LostFoundModel.find({ role: oppositeRole })
      .select("image _id name description") // хэрэгтэй талбарууд
      .lean();
 
    // 3) Threshold тавина (жишээ нь 0.75 = 75%)
    const threshold = 0.5;
 
    // 5️⃣ MAP + PROMISE.ALL
    // ===============================
    const results = await Promise.all(
      candidates.map(async (c) => {
        if (!c.image) return null;
 
        const candEmbedding = await getImageEmbedding(c.image);
 
        const similarity = cosineSimilarity(newEmbedding, candEmbedding); // 0 → 1
 
        if (similarity < threshold) return null;
        return {
          matchId: String(c._id),
          matchScore: Math.round(similarity * 100),
          image: c.image,
          name: c.name,
          description: c.description,
        };
      }),
    );
 
    // null-уудыг цэвэрлэнэ
    const matches = results
      .filter(Boolean)
      .sort((a: any, b: any) => b.matchScore - a.matchScore);
 
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
      matches: matches.map((m: any) => ({
        postId: m.matchId,
        score: m.matchScore,
      })),
    });
 
    res.status(200).json({
      success: true,
      data: matches.map((m: any) => ({
        ...m,
        confidence:
          m.matchScore >= 85
            ? "HIGH"
            : m.matchScore >= 70
              ? "MEDIUM"
              : m.matchScore <= 50
                ? "LOW"
                : "NULL",
      })),
      dataLength: matches.length,
    });
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
 
 