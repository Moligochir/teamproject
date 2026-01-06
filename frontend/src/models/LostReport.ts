import { Schema, model, models, Types } from "mongoose";

const LostReportSchema = new Schema({
  userId: { type: Types.ObjectId, required: true },

  pet: {
    species: String,
    breed: String,
    color: String
  },

  imageUrl: String,

  embedding: {
    type: [Number],   // CLIP vector
    required: true
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: [Number] // [lng, lat]
  },

  status: {
    type: String,
    enum: ["OPEN", "MATCHED", "CLOSED"],
    default: "OPEN"
  }
}, { timestamps: true });

export default models.LostReport ||
  model("LostReport", LostReportSchema);
