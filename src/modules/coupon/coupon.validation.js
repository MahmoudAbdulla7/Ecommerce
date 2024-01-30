import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createCoupon =joi.object({
    name:joi.string().min(2).max(25).required(),
    amount:joi.number().positive().min(1).max(100).required(),
    file:generalFields.file,
    expireDate:joi.date().greater(Date.now()).required()
}).required();

export const updateCoupon =joi.object({
    name:joi.string().min(2).max(25),
    amount:joi.number().positive().min(1).max(100),
    couponId:generalFields.id,
    file:generalFields.file,
    expireDate:joi.date().greater(Date.now())

}).required();