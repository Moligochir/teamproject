import { Request, request, Response, response } from "express";
import { LostFoundModel } from "../../models/LostFoundModel";

export const getLostFound = async (req: Request, res: Response) => {
  const dbLostFound = await LostFoundModel.find();

  res.status(200).json(dbLostFound);
};
