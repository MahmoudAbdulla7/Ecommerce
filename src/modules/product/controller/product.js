import {asyncHandler} from '../../../utils/errorHandling.js';
import SubCategory from '../../../../DB/model/SubCategory.model.js';
import Brand from '../../../../DB/model/Brand.model.js';
import { nanoid } from 'nanoid';
import cloudinary from '../../../utils/cloudinary.js'
import Product from '../../../../DB/model/Product.js';
import slugify from 'slugify';
import User from '../../../../DB/model/User.model.js';
import ApiFeatures from '../../../utils/ApiFeatures.js';

export const createProduct =asyncHandler(async(req,res,next)=>{
    const {subcategoryId,brandId,categoryId,name,discount,price}=req.body;
    if (!await SubCategory.findOne({_id:subcategoryId,categoryId})) {
        return next(new Error("in-valid category or subcategory Id",{cause:404}));
    }
    if (!await Brand.findById(brandId)) {
        return next(new Error("in-valid brand Id",{cause:404}));
    }
    req.body.slug=slugify(name,{
        replacement:"-",
        trim:true,
        lower:true
    })
    
    req.body.finalPrice=parseFloat(price-((discount||0)/100)*price).toFixed(2);
    req.body.customId=nanoid();
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}`});
    req.body.mainImage={secure_url,public_id};

    if (req.files.subImage) {
        req.body.subImage=[];
        for (const file of req.files.subImage) {
            const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subImage`});
        req.body.subImage.push({secure_url,public_id});
        }
    }

    req.body.createdBy=req.user._id;
    const product=await Product.create(req.body);
    if (!product) {
        return next(new Error("fail to create product",{cause:400}))
    }
    return res.status(201).json({message:"created",product});
});

export const updateProduct =asyncHandler(async(req,res,next)=>{
    const {productId}=req.params;
    const product =await Product.findById(productId);

    if (!product) {
        return next(new Error("in-valid product id",{cause:404}));
    }

    const {subcategoryId,brandId,categoryId,name,price,discount}=req.body;
    if (subcategoryId&&categoryId) {
        if (!await SubCategory.findOne({_id:subcategoryId,categoryId})) {
            return next(new Error("in-valid category or subcategory Id",{cause:404}));
        }
    }

    if (brandId) {
    if (!await Brand.findById(brandId)) {
        return next(new Error("in-valid brand Id",{cause:404}));
    }
    }

    if (name) {
        req.body.slug=slugify(name,{
            replacement:"-",
            trim:true,
            lower:true
        })
    }

    if (price&&discount) {
    req.body.finalPrice=parseFloat(price-((discount||0)/100)*price).toFixed(2);
    }else if(price){
    req.body.finalPrice=parseFloat(price-((product.discount)/100)*price).toFixed(2);
    }else if(discount){
    req.body.finalPrice=parseFloat(product.price-((discount||0)/100)*product.price).toFixed(2);
    }

    if (req.files?.mainImage?.length) {
        const pathOfMainImage=req.files.mainImage[0].path
        const {secure_url,public_id}=await cloudinary.uploader.upload(pathOfMainImage,{folder:`${process.env.APP_NAME}/product/${product.customId}`});
        await cloudinary.uploader.destroy(product.mainImage.public_id);
        req.body.mainImage={secure_url,public_id};
    }

    if (req.files?.subImage?.length) {
        req.body.subImage=[]
        for (const file of req.files.subImage) {
            const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/${req.body.customId}/subImage`});
        req.body.subImage.push({secure_url,public_id})
    
        }
    }

    req.body.updatedBy=req.user._id;
    await Product.updateOne({_id:product._id},req.body);

    return res.status(200).json({message:"updated"});
});

export const getProducts =asyncHandler(async(req,res,next)=>{
    const apiFeature =new ApiFeatures(Product.find().populate([{path: "Review"}]),req.query).paginate().filter().sort();
    const products =await apiFeature.mongooseQuery;

    for (let i = 0; i < products.length; i++) {
        let calcRating=0;
        for (let j = 0; j < products[i].Review.length; j++) {
            calcRating += products[i].Review[j].rating;
        }
        let avgRating =calcRating/products[i].Review.length;
        const product =products[i].toObject();
        product.avgRating =avgRating;
        products[i]=product;
    }
    res.status(200).json({products});
});

export const addToWishList =asyncHandler(async(req,res,next)=>{
    const {productId}=req.params;
    const product=await Product.findById(productId);
    if (!product) {
        return next("in-valid product id",{cause:404});
    }
    await User.updateOne({_id:req.user._id},{$addToSet:{wishList:product._id}});
    return res.status(200).json({message:"Done"})
});

export const removeProductFromWishList =asyncHandler(async(req,res,next)=>{
    const {productId}=req.params;
    await User.updateOne({_id:req.user._id},{$pull:{wishList:productId}});
    return res.status(200).json({messsage:"Done"})
})