import joi from "joi";
import {generalFields} from '../../middleware/validation.js';

export const createCart =joi.object({
    productId:generalFields.id.required(),
    quantity:joi.number().positive().required()
}).required();

export const deleteItems =joi.object({
    productIds:joi.array().items(generalFields.id.required()).required(),
}).required();