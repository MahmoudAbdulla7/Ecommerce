import cloudinary from "../../../utils/cloudinary.js";
import Category from '../../../../DB/model/Category.model.js'
import slugify from "slugify";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCategory =asyncHandler(async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    if (await Category.findOne({name})) {
        next(new Error(`Duplicated Category name :${name}`,{cause:409}));
    }
    const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
    const category = await Category.create({name, image:{secure_url,public_id},slug:slugify(name,'-'),createdBy:req.user._id});
    return res.status(201).json({message:"Done",category});
});

export const updateCategory =asyncHandler(async(req,res,next)=>{
    const category =await Category.findById(req.params.categoryId);
    if(req.body.name.toLowerCase()){
    const name=req.body.name.toLowerCase();
        if (category.name==name) {
            return next(new Error(`sorry can not update category with the same name`,{cause:409}));
        }
        if (await Category.findOne({name})) {
            next(new Error(`Duplicated Category name:${name}`,{cause:409}));
        }
        category.name=name;
        category.slug=slugify(name);
    }
    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/category`});
        await cloudinary.uploader.destroy(category.image.public_id);
        category.image ={secure_url,public_id};
    }    
    category.updatedBy=req.user._id;
    await category.save();
    return res.status(200).json({message:"Done",category});
});

export const getCategories =asyncHandler(async(req,res,next)=>{
   const categories= await Category.find({}).populate([{
    path:'Subcategory'
   }]);
    return res.status(200).json({message:"Done",categories});
});
