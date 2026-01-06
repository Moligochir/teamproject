import { Request, Response } from "express";
import { UserModel } from "../../models/model-user";
export const getUsers = async (req: Request, res: Response) => {
  const dbUsers = await UserModel.find();
  console.log(dbUsers);

  res.status(200).json(dbUsers);
};
