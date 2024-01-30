import mongoose, { Types } from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true ,unique:true,lowercase: true},
    image: { type: Object,required:true},
    createdBy: { type: Types.ObjectId,ref:"User", required: true },
    updatedBy:{type:Types.ObjectId,ref:"User"}
  },
  {
    timestamps: true,
  }
);

const Brand =
  mongoose.models.Brand || mongoose.model("Brand", BrandSchema);
export default Brand;
