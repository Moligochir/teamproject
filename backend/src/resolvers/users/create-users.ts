import { Request, Response } from "express";
import { UserModel } from "../../models/model-user";

export const CreateUser = async (req: Request, res: Response) => {
  const newUser = req.body;
  try {
    await UserModel.create({
      clerkId: newUser.clerkId,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      phonenumber: newUser.phonenumber,
    });
    res.status(200).json({ message: "User created successfully" });
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
