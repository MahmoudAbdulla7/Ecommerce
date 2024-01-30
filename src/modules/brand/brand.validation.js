import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createBrand =joi.object({
    name:joi.string().min(2).max(25).required(),
    file:generalFields.file.required()
}).required();

export const updateBrand =joi.object({
    name:joi.string().min(2).max(25),
    brandId:generalFields.id,
    file:generalFields.file
}).required();