import cloudinary from "../../../utils/cloudinary.js";
import Subcategory from '../../../../DB/model/SubCategory.model.js'
import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";
import Category from '../../../../DB/model/Category.model.js'
import { nanoid } from "nanoid";

export const createSubcategory =asyncHandler(async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    const {categoryId}=req.params;
    if (!await Category.findById(categoryId)) {
        return next(new Error("in-valid category id",{cause:404}));
    }

    if (await Subcategory.findOne({name})) {
        next(new Error(`Duplicated Subcategory name :${name}`,{cause:409}));
    }

    const customId=nanoid();
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${categoryId}/${customId}`});
    const subcategory = await Subcategory.create({name, image:{secure_url,public_id},slug:slugify(name,'-'),customId,categoryId,createdBy:req.user._id})
    return res.status(201).json({message:"Done",subcategory});
});

export const updateSubcategory =asyncHandler(async(req,res,next)=>{
    const subcategory =await Subcategory.findOne({_id:req.params.subcategoryId,categoryId:req.params.categoryId});
    if(req.body.name){
    const name=req.body.name.toLowerCase();

        if (subcategory.name==name) {
            return next(new Error(`sorry can not update subcategory with the same name`,{cause:409}));
        }
        if (await Subcategory.findOne({name})) {
            next(new Error(`Duplicated subcategory name:${req.body.name}`,{cause:409}));
        }
        subcategory.name=name;
        subcategory.slug=slugify(req.body.name);
    }
    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category/${req.params.categoryId}/${subcategory.customId}`});
        await cloudinary.uploader.destroy(subcategory.image.public_id);
        subcategory.image ={secure_url,public_id};
    }    
    subcategory.updatedBy=req.user._id;
    await subcategory.save();
    return res.status(201).json({message:"Done",subcategory});
});

export const getSubcategories =asyncHandler(async(req,res,next)=>{
   const subCategories= await Subcategory.find({}).populate([{
    path:'categoryId'
   }]);
    return res.status(200).json({message:"Done",subCategories});
});

