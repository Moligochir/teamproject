import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";

export const getLostFound = async (req: Request, res: Response) => {
  try {
    // ✅ Filter out hidden posts by default
    const lostFoundPosts = await LostFoundModel.find({
      isHidden: { $ne: true },
    }).sort({ createdAt: -1 });

    res.json(lostFoundPosts);
  } catch (error) {
    console.error("Error fetching lost and found posts:", error);
    res.status(500).json({
      error: "Failed to fetch posts",
    });
  }
};
