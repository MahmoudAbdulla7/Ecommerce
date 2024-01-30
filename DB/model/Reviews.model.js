import mongoose, { Types } from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true},
    rating: { type: Number,required:true , min: 1, max:5},
    createdBy: { type: Types.ObjectId,ref:"User", required: true },
    productId:{type:Types.ObjectId,ref:"Product",required:true},
    orderId:{type:Types.ObjectId,ref:"Order",required:true},
  },
  {
    timestamps: true,
  }
);

const Review =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
export default Review;
