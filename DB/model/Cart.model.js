import mongoose, { Types } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    createdBy: { type: Types.ObjectId,ref:"User", required: true,unique:true },
    products:[{
        productId:{type: Types.ObjectId,ref:"Product", required: true },
        quantity:{type:Number,default:1,required:true}
    }]
  },
  {
    timestamps: true,
  }
);

const Cart =mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
