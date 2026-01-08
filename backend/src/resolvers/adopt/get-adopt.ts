import { Request, Response } from "express";
import { AdoptSchemaModel } from "../../models/model-apopt";

export const getAdopt = async (req: Request, res: Response) => {
  const dbAdopt = await AdoptSchemaModel.find();

  res.status(200).json(dbAdopt);
};
