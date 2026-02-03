import { Request, Response } from "express";
import { AdoptSchemaModel } from "../../models/model-apopt";

export const getAdopt = async (req: Request, res: Response) => {
  try {
    const adopts = await AdoptSchemaModel.find();

    res.status(200).json(adopts);
  } catch (error) {
    console.error("❌ Get adopt error:", error);

    res.status(500).json({
      message: "Failed to fetch adopt data",
    });
  }
};
