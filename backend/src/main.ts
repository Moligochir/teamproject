import { User } from "./routes/users";
import { Adopt } from "./routes/adopt";
import { LostFound } from "./routes/lostFound";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Shop } from "./routes/shop";
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use("/adopt", Adopt);
app.use("/users", User);
app.use("/lostFound", LostFound);
app.use("/shop", Shop);

mongoose
  .connect(
    "mongodb+srv://welovepetspawpew_db_user:Pawpew1234@cluster0.gdp0zjv.mongodb.net/",
  )
  .then(() => console.log("connected"));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/users`);
});
