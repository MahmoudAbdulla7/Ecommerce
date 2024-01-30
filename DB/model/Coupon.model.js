import mongoose, { Types } from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true ,unique:true,lowercase: true},
    image: { type: Object},
    createdBy: { type: Types.ObjectId,ref:"User", required: true },
    updatedBy:{type:Types.ObjectId,ref:"User"},
    amount:{type:Number,default:1},
    expireDate:{type:Date},
    usedBy:[{ type: Types.ObjectId,ref:"User"}]
  },
  {
    timestamps: true,
  }
);

const Coupon =
  mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
export default Coupon;
