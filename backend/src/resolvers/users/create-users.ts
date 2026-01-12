import { Request, Response } from "express";
import { UserModel } from "../../models/model-user";

export const CreateUser = async (req: Request, res: Response) => {
  // const checkuser = await prisma.user.findFirst({ where: { clerkId: user } });

  try {
    const newUser = req.body;
    if (!newUser.clerkId || !newUser.email) {
      return res.status(409).json({
        message: "clerkId and email are required",
      });
    }
    const checkuser = await UserModel.findOne(
      { clerkId: newUser.clerkId },
      { email: newUser.email }
    );
    if (checkuser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await UserModel.create({
      clerkId: newUser.clerkId,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      phonenumber: newUser.phonenumber,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (e: unknown) {
    res.status(500).json({ message: (e as Error).message });
    console.log(e);
  }
};
