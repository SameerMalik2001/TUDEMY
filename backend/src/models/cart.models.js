import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    courseId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Cart = mongoose.model('Cart', CartSchema);