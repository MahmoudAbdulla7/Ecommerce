import cloudinary from "../../../utils/cloudinary.js";
import Coupon from '../../../../DB/model/Coupon.model.js'
import { asyncHandler } from "../../../utils/errorHandling.js";

export const createCoupon =asyncHandler(async(req,res,next)=>{
    const name=req.body.name.toLowerCase();
    if (await Coupon.findOne({name})) {
        next(new Error(`Duplicated coupon name :${req.body.name}`,{cause:409}));
    }

    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon`});
        req.body.image={secure_url,public_id};
    };

    req.body.name=name;
    req.body.createdBy=req.user._id;
    req.body.expireDate=new Date(req.body.expireDate);
    const coupon = await Coupon.create(req.body);
    return res.status(201).json({message:"Done",coupon});
});

export const updateCoupon =asyncHandler(async(req,res,next)=>{
    const coupon =await Coupon.findById(req.params.couponId);
    if(req.body.name){
    const name=req.body.name.toLowerCase()
        if (coupon.name==name) {
            return next(new Error(`sorry can not update coupon with the same name`,{cause:409}));
        }
        if (await Coupon.findOne({name})) {
            next(new Error(`Duplicated coupon name:${req.body.name}`,{cause:409}));
        }
        coupon.name=name;
    }
    if(req.body.amount){
        coupon.amount=req.body.amount
    }
    if (req.body.expireDate) {
     coupon.expireDate=new Date(req.body.expireDate);
    }
    if (req.file) {
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/coupon`});
        if (coupon.image) {
            await cloudinary.uploader.destroy(coupon.image.public_id);
        }
        coupon.image ={secure_url,public_id};
    }    
    if (req.body.expireDate) {
        coupon.expireDate=req.body.expireDate;
    }
    coupon.updatedBy=req.user._id;
    await coupon.save();
    return res.status(200).json({message:"Done",coupon});
});

export const getCoupon =asyncHandler(async(req,res,next)=>{
   const coupon= await Coupon.find({});
    return res.status(200).json({message:"Done",coupon});
});
