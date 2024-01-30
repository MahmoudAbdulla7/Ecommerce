import cloudinary from "../../../utils/cloudinary.js";
import Brand from '../../../../DB/model/Brand.model.js'
import { asyncHandler } from "../../../utils/errorHandling.js";


export const createBrand =asyncHandler(async(req,res,next)=>{
    const name =req.body.name.toLowerCase();

    if (await Brand.findOne({name})) {
        next(new Error(`Duplicated brand name :${req.body.name}`,{cause:409}));
    }

    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`});
        req.body.image={secure_url,public_id};
    }

    req.body.name=name;
    const brand = await Brand.create({...req.body,createdBy:req.user._id});
    return res.status(201).json({message:"Done",brand});
});

export const updateBrand =asyncHandler(async(req,res,next)=>{

    const brand =await Brand.findById(req.params.brandId);

    if(req.body.name){
    const name =req.body.name.toLowerCase();
        if (brand.name==name) {
            return next(new Error(`sorry can not update brand with the same name`,{cause:409}));
        }
        if (await Brand.findOne({name})) {
            next(new Error(`Duplicated brand name:${req.body.name}`,{cause:409}));
        }
        brand.name=name;
    }

    if(req.body.amount){
        brand.amount=req.body.amount;
    }

    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/brand`});
        if (brand.image) {
            await cloudinary.uploader.destroy(brand.image.public_id);
        }
        brand.image ={secure_url,public_id};
    } 
    
    brand.updatedBy=req.user._id;
    await brand.save();
    return res.status(200).json({message:"Done",brand});
});

export const getBrand =asyncHandler(async(req,res,next)=>{
   const brand= await Brand.find({})
    return res.status(200).json({message:"Done",brand});
});
