import Product from '../../../../DB/model/Product.js';
import Cart from '../../../../DB/model/Cart.model.js';
import { asyncHandler } from '../../../utils/errorHandling.js';

export const createCart =async (req ,res,next)=>{
    const {productId,quantity}=req.body;
    const product = await Product.findById(productId);

    if (!product) {
        return next(new Error("in-valid productId",{cause:404}));
    }

    if (product.stock <quantity|| product.isDeleted) {
        await Product.updateOne({_id:productId},{$addToSet:{wishList:req.user._id}});
        return next(new Error(`in-valid product quantity max available is ${product.stock}`,{cause:400}));
    }

    const cart =await Cart.findOne({createdBy:req.user._id});

    if (!cart) {
        const newCart= await Cart.create({
            createdBy:req.user._id,
            products:[{productId,quantity}]
        })
        return res.status(201).json({message:"Done",newCart })
    }

    let checkProductExistInCart =false;
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId==productId) {
            cart.products[i].quantity=quantity;
            checkProductExistInCart=true;
            break;
        }
    }

    if (!checkProductExistInCart) {
        cart.products.push({productId,quantity});
    };

    await cart.save();
    res.status(200).json({message:"Done",cart})
};

export async function deleteItemsFromCart (createdBy,productIds){
    await Cart.updateOne({createdBy},{
        $pull:{
            products:{
                productId:{$in:productIds}
            }
        }
    })
};

export const deleteItems =asyncHandler(async(req,res,next)=>{
    const {productIds}=req.body;

    await deleteItemsFromCart(req.user._id,productIds);

    return res.status(200).json({message:"items has been deleted"});
});

export async function clearAllItems (createdBy){
    await Cart.updateOne({createdBy},{products:[]});
};

export const emptyCart =asyncHandler(async(req,res,next)=>{
    await clearAllItems(req.user._id);
    return res.status(200).json({message:"Done"});
});