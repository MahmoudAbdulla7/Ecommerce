import { Router } from "express";
import {fileUpload,fileValidation} from '../../utils/multer.js'
import * as subCategoryController from './controller/subCategory.js'
import { validation } from "../../middleware/validation.js";
import * as validators from "./subcategory.validation.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "../brand/brand.endPoint.js";

const router = Router({mergeParams:true});

router.post("/",fileUpload(fileValidation.image).single('image'),
            validation(validators.createsubCategory),
            auth(endPoint.create),
            subCategoryController.createSubcategory);
            
router.put("/:subcategoryId",fileUpload(fileValidation.image).single('image'),
            validation(validators.updatesubCategory),
            auth(endPoint.update),
            subCategoryController.updateSubcategory);

router.get("/",subCategoryController.getSubcategories);

export default router