import { getUsers } from "../resolvers/users/get-users.js";
import express from "express";
export const router = express.Router();

router.get("/", getUsers);
