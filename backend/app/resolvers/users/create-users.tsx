import { Request, Response } from "express";
import { UserModel } from "../../models/model-user";
type CreateUserBody = {
  clerkId: string;
  name: string;
  role: string;
  email: string;
  phonenumber: number;
  createdAt?: Date;
  updatedAt?: Date;
};
export const CreateUser = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response
) => {
  const { email, phonenumber, clerkId, name, role } = req.body;
  const dbUsers = await UserModel.create({
    clerkId,
    name,
    role,
    email,
    phonenumber,
  });

  res.status(200).json(dbUsers);
};
