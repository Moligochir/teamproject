import express from "express";
import { getUsers } from "../resolvers/users/get-users";
export const User = express.Router();

User.get("/", getUsers);
