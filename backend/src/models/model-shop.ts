import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const ShopModel =
  mongoose.models.Shop || mongoose.model("Shop", ShopSchema);
