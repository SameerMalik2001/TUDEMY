import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
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

export const Wishlist = mongoose.model('Wishlist', WishlistSchema);