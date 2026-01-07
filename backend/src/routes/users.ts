import express from "express";
import { getUsers } from "../resolvers/users/get-users";
import { CreateUser } from "../resolvers/users/create-users";
export const User = express.Router();

User.get("/", getUsers);
User.post("/", CreateUser);
