import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const createsubCategory =joi.object({
    name:joi.string().min(2).max(25).required(),
    categoryId:generalFields.id,
    file:generalFields.file.required()
}).required();
export const updatesubCategory =joi.object({
    subcategoryId:generalFields.id.required(),
    categoryId:generalFields.id.required(),
    name:joi.string().min(2).max(25),
    file:generalFields.file
}).required();