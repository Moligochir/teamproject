import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  id: ObjectId,
  ProductName: String,
  ImageURL: String,
  Price: Number,
  PhoneNumber: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export const ProductModel = mongoose.model("Product", UserSchema);
