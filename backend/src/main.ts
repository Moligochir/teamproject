import express from "express";
import mongoose from "mongoose";
import { User } from "./routes/users";
const app = express();
const port = 8000;

app.use(express.json());
app.use("/users", User);

mongoose
  .connect(
    "mongodb+srv://welovepetspawpew_db_user:Pawpew1234@cluster0.gdp0zjv.mongodb.net/"
  )
  .then(() => console.log("connected"));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/users`);
});
