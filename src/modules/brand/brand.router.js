import { Router } from "express";
import {fileUpload,fileValidation} from '../../utils/multer.js'
import * as brandController from './controller/brand.js'
import { validation } from "../../middleware/validation.js";
import * as validators from "./brand.validation.js";
import {auth} from '../../middleware/auth.js'
import { endPoint } from "./brand.endPoint.js";

const router = Router();

router.post("/",fileUpload(fileValidation.image).single('image'),
            validation(validators.createBrand),
            auth(endPoint.create),
            brandController.createBrand);

router.put("/:brandId",fileUpload(fileValidation.image).single('image'),
            validation(validators.updateBrand),
            auth(endPoint.update), brandController.updateBrand);

router.get("/",brandController.getBrand);

export default router;