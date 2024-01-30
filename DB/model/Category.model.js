import mongoose, { Types } from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true ,unique:true,lowercase: true},
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId,ref:"User", required: true },
    updatedBy:{type:Types.ObjectId,ref:"User"}
  },
  {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},

  }
);
CategorySchema.virtual("Subcategory",{
  localField:"_id",
  foreignField:"categoryId",
  ref:"Subcategory"
})


const Category =
  mongoose.models.Category || mongoose.model("Category", CategorySchema);
export default Category;
