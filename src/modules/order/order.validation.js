import joi from"joi";
import {generalFields} from '../../middleware/validation.js'

export const createOrder =joi.object({
    note:joi.string().min(1),
    address:joi.string().min(1).required(),
    phone:joi.array().items(joi.string().pattern(new RegExp((/^(002|\+2)?01[0125][0-9]{8}$/)))).min(1).max(3).required(),
    couponName:joi.string(),
    paymentType:joi.string().valid("cash","card"),
    products:joi.array().min(1).items(joi.object({
        productId:generalFields.id,
        quantity:joi.number().min(1).positive().integer().required()
    }).required())
});

export const cancel =joi.object({
    reason:joi.string().min(3).max(1000).required(),
    orderId:generalFields.id
});

export const update =joi.object({
    status:joi.string().valid('onWay','delivered').required(),
    orderId:generalFields.id
});