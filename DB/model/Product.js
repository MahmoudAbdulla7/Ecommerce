import mongoose ,{Types} from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true ,trim:true,lowercase: true},
    slug: { type: String, trim:true,required: true,lowercase:true },
    description:String,
    stock:{type:Number,default:1},
    price:{type:Number,default:1},
    discount:{type:Number,default:0},
    finalPrice:{type:Number,default:1},
    colors:[String],
    size:{type:[String],enum:['s','m','lg','xl']},
    mainImage: { type: Object, required: true },
    subImage: { type: [Object] },
    categoryId: { type: mongoose.Types.ObjectId,ref:"Category", required: true },
    subcategoryId: { type: mongoose.Types.ObjectId,ref:"Subcategory", required: true },
    brandId: { type: mongoose.Types.ObjectId,ref:"Brand", required: true },
    createdBy: { type: Types.ObjectId,ref:"User", required: true },
    updatedBy:{type:Types.ObjectId,ref:"User"},
    wishList:[{type:Types.ObjectId,ref:"User"}],
    isDeleted:{type:Boolean,default:false},
    customId: { type: String, required: false },
  },
  {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true,
  }
);
ProductSchema.virtual("Review",{
  ref:"Review",
  localField:"_id",
  foreignField:"productId"
})

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
