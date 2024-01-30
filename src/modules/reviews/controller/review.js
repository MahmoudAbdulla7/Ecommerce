import {asyncHandler} from '../../../utils/errorHandling.js';
import Order from '../../../../DB/model/Order.model.js';
import Review from '../../../../DB/model/Reviews.model.js';

export const createComment =asyncHandler(async(req,res,next)=>{
    const {productId}=req.params;
    const {rating,comment}=req.body;
    const order =await Order.findOne({userId:req.user._id , status:"delivered", "products.productId":productId});

    if (!order) {
        return next(new Error("can not review before receive it",{cause:400}));
    };

    const oldReview =await Review.findOne({createdBy:req.user._id,productId,orderId:order._id});
    if (oldReview) {
        return next(new Error("this product is already reviewed by you",{cause:409}));
    };

    await Review.create({productId ,orderId:order._id,createdBy:req.user._id,rating,comment});
    return res.status(201).json({message:"Done"});
});

export const updateComment =asyncHandler(async(req,res,next)=>{
    const {productId,reviewId}=req.params;
    await Review.updateOne({_id:reviewId,productId},req.body);
    return res.status(200).json({message:"Done"})
});