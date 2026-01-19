import { Request, Response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";

export const FindIdLostFound = async (req: Request, res: Response) => {
  try {
    const LostFound = await LostFoundModel.find({
      _id: req.params.id,
    }).populate("userId");
    res.status(200).json(LostFound);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
