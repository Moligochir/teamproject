"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLostFound = void 0;
const LostFoundModel_1 = require("../../models/LostFoundModel");
const deleteLostFound = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID",
            });
        }
        // Find and delete post
        const deletedPost = await LostFoundModel_1.LostFoundModel.findByIdAndDelete(id);
        // Check if post exists
        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        // Success response
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: deletedPost,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message,
        });
    }
};
exports.deleteLostFound = deleteLostFound;
