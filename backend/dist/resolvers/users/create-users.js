"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
const model_user_1 = require("../../models/model-user");
const CreateUser = async (req, res) => {
    // const checkuser = await prisma.user.findFirst({ where: { clerkId: user } });
    try {
        const newUser = req.body;
        if (!newUser.clerkId || !newUser.email) {
            return res.status(409).json({
                message: "clerkId and email are required",
            });
        }
        const checkuser = await model_user_1.UserModel.findOne({ clerkId: newUser.clerkId }, { email: newUser.email });
        if (checkuser) {
            return res.status(201).json({ message: "User already exists" });
        }
        const user = await model_user_1.UserModel.create({
            clerkId: newUser.clerkId,
            name: newUser.name,
            role: newUser.role,
            email: newUser.email,
            phonenumber: newUser.phonenumber,
        });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (e) {
        res.status(500).json({ message: e.message });
        console.log(e);
    }
};
exports.CreateUser = CreateUser;
