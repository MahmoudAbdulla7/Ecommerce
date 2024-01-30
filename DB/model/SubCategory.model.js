import mongoose ,{Types} from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true ,unique:true,lowercase: true},
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    categoryId: { type: mongoose.Types.ObjectId,ref:"Category", required: false },
    createdBy: { type: Types.ObjectId,ref:"User", required: true },
    updatedBy:{type:Types.ObjectId,ref:"User"},
    customId: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Subcategory = mongoose.models.Subcategory || mongoose.model("Subcategory", subcategorySchema);
export default Subcategory;
