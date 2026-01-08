import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AdoptSchema = new Schema(
  {
    id: ObjectId,
    userId: {
      type: mongoose.Schema.Types.String,
      require: true,
      ref: "User",
    },
    petType: { type: String, enum: ["Dog", "Cat"] },
    name: { type: String, require: true },
    age: { type: Number },
    gender: { type: String, require: true },
    image: { type: String, require: true },
    breed: String,
    description: { type: String, require: true },
    createAt: { type: Date, default: Date.now },
    adoptType: { type: String, enum: ["YES", "NO"], default: "NO" },
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export const AdoptSchemaModel = mongoose.model("Adopt", AdoptSchema);
