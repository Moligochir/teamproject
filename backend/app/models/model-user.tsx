import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  id: ObjectId,
  clerkId: String,
  email: String,
  name: String,
  phonenunmber: String,
  role: {
    type: String,
    enum: ["USER", "ADMIN"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const UserModel = mongoose.model("User", UserSchema);
