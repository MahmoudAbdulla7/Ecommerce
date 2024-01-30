import joi from "joi";
import {generalFields} from '../../middleware/validation.js';

export const createProduct =joi.object({
    name:joi.string().min(2).max(150).required(),
    description:joi.string().min(2).max(150000),
    size:joi.array(),
    stock:joi.number().positive().integer().min(1).required(),
    price:joi.number().positive().min(1).required(),
    discount:joi.number().positive().min(1),
    categoryId:generalFields.id,
    brandId:generalFields.id,
    subcategoryId:generalFields.id,
    colors:joi.array().items().min(2),
    file:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1).required(),
        subImage:joi.array().items(generalFields.file.required()).min(1).max(5)
    }).required()
}).required();

export const updateProduct =joi.object({
    name:joi.string().min(2).max(150),
    description:joi.string().min(2).max(150000),
    size:joi.array(),
    size:joi.array(),
    stock:joi.number().positive().integer().min(1),
    price:joi.number().positive().min(1),
    discount:joi.number().positive().min(1),
    categoryId:generalFields.optionalId,
    brandId:generalFields.optionalId,
    subcategoryId:generalFields.optionalId,
    productId:generalFields.optionalId,
    colors:joi.array(),
    file:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).max(1),
        subImage:joi.array().items(generalFields.file.required()).min(1).max(5)
    })
}).required();

export const wishList =joi.object({
    productId:generalFields.id
}).required();