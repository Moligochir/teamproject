import { Request, Response } from "express";
import { AdoptSchemaModel } from "../../models/model-apopt";
import mongoose from "mongoose";

type Params = {
  id: string;
};
export const FindIdAdopt = async (req: Request, res: Response) => {
  const { id } = req.params as Params;
  if (!id) {
    return res.status(404).json({ message: "ID is required" });
  }
  console.log("THIS IS ID:", id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid adopt id (Mongo ObjectId байх ёстой)",
      received: id,
    });
  }
  try {
    const Adoption = await AdoptSchemaModel.find({
      _id: id,
    }).populate("userId");
    res.status(200).json(Adoption);
  } catch (error) {
    console.error("SERVER ERROR", error);
    res.status(500).json({ message: "Server Error" });
  }
};
