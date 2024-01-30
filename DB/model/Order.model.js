import mongoose, { Types } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId:{type:Types.ObjectId,ref:"User",required:true},
    address:{type:String,required:true},
    phone:[{type:String,required:true}],
    note:String,
    products:[{
        name:{type:String,required:true},
        productId:{type: Types.ObjectId,ref:"Product", required: true },
        quantity:{type:Number,default:1,required:true},
        unitPrice:{type:Number,default:1,required:true},
        finalPrice:{type:Number,default:1,required:true}
    }],
    couponId:{type:Types.ObjectId,ref:"Coupon"},
    subTotal:{type:Number,default:1,required:true},
    finalPrice:{type:Number,default:1,required:true},
    paymentType:{type:String,default:"cash",enum:["cash","card"]},
    status:{type:String,default:'placed',enum:["waitPayment",'placed','canceled','rejected','onWay','delivered']},
    reason:String,
    updatedBy:{type:Types.ObjectId,ref:"User"},
  },
  {
    timestamps: true,
  }
);
const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
