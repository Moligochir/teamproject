import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";

export const putLostFound = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, breed, petType, description, role, location, image } =
      req.body;

    // Validate ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    // Validate required fields
    if (!name || !petType || !role || !location || !description) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, petType, role, location, description",
      });
    }

    // Validate role value
    if (!["Lost", "Found"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'Lost' or 'Found'",
      });
    }

    // Validate petType value
    if (!["Dog", "Cat"].includes(petType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid petType. Must be 'Dog' or 'Cat'",
      });
    }

    // Build update object
    const updateData: any = {
      name,
      petType,
      role,
      location,
      description,
      updatedAt: new Date(),
    };

    // Optional fields
    if (breed) updateData.breed = breed;
    if (image) updateData.image = image;

    // Find and update post
    const updatedPost = await LostFoundModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Check if post exists
    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error: any) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update post",
      error: error.message,
    });
  }
};
