import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AdoptSchema = new Schema(
  {
    id: ObjectId,
    userId: { type: String, require: true },
    name: { type: String, require: true },
    age: { type: Number, require: true },
    gender: { type: String, require: true },
    image: { type: String, require: true },
    breed: { type: String, require: true },
    description: { type: String, require: true },
    createAt: { type: Date, default: Date.now },
    adoptType: { type: String, enum: ["YES", "NO"] },
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const AdoptSchemaModel = mongoose.model("Adopt", AdoptSchema);
