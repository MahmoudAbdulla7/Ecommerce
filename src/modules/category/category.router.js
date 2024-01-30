import { Router } from "express";
import {fileUpload,fileValidation} from '../../utils/multer.js'
import * as categoryController from './controller/category.js'
import { validation } from "../../middleware/validation.js";
import * as validators from "./category.validation.js";
import subcategory from '../subcategory/subcategory.router.js'
import {auth} from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";
const router = Router()
router.use("/:categoryId/subcategory",subcategory)

router.post("/",fileUpload(fileValidation.image).single('image'),
            validation(validators.createCategory),auth(endPoint.create),
            categoryController.createCategory);

router.put("/:categoryId",fileUpload(fileValidation.image).single('image'),
            validation(validators.updateCategory),
            auth(endPoint.update),
            categoryController.updateCategory);

router.get("/",categoryController.getCategories);




export default router