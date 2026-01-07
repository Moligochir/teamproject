import express from "express";
import { CreateAdopt } from "../resolvers/adopt/create-adopt";

export const Adopt = express.Router();

Adopt.post("/", CreateAdopt);
