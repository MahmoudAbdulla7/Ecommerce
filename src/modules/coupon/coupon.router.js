import { Router } from "express";
import {fileUpload,fileValidation} from '../../utils/multer.js'
import * as couponController from './controller/coupon.js'
import { validation } from "../../middleware/validation.js";
import * as validators from "./coupon.validation.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "../brand/brand.endPoint.js";
const router = Router();

router.post("/",fileUpload(fileValidation.image).single('image'),
            validation(validators.createCoupon),
            auth(endPoint.create),
            couponController.createCoupon);

router.put("/:couponId",fileUpload(fileValidation.image).single('image'),
            validation(validators.updateCoupon),
            auth(endPoint.update),
            couponController.updateCoupon);

router.get("/",couponController.getCoupon);

export default router