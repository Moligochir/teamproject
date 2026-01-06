import { UserModel } from "../../models/model-user";
import { Request, Response } from "express";
export const getUsers = async (req: Request, res: Response) => {
  const dbUsers = await UserModel.find();
  console.log(dbUsers);

  res.status(200).json(dbUsers);
};
