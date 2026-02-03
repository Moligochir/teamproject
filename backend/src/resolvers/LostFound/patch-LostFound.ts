import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";

export const patchLostFound = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    // Validate input
    if (typeof isHidden !== "boolean") {
      return res.status(400).json({
        error: "isHidden must be a boolean",
      });
    }

    // Find and update post
    const updatedPost = await LostFoundModel.findByIdAndUpdate(
      id,
      { isHidden: isHidden },
      { new: true },
    );

    if (!updatedPost) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post visibility:", error);
    res.status(500).json({
      error: "Failed to update post visibility",
    });
  }
};
