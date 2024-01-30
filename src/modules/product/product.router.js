import { Router } from "express";
import * as productController from "./controller/product.js";
import {fileUpload, fileValidation} from '../../utils/multer.js';
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./product.endPoint.js";
import * as validators from './product.validation.js';
import {validation} from '../../middleware/validation.js';
import reviewRouter from '../reviews/reviews.router.js';

const router = Router();

router.use("/:productId/review",reviewRouter);

router.get("/",productController.getProducts);

router.post("/",fileUpload(fileValidation.image).fields([
    {name:"mainImage",maxCount:1},
    {name:"subImage",maxCount:5}
]),validation(validators.createProduct),auth(endPoint.create),productController.createProduct);

router.put("/:productId",fileUpload(fileValidation.image).fields([
    {name:"mainImage",maxCount:1},
    {name:"subImage",maxCount:5}
]),validation(validators.updateProduct),auth(endPoint.update),productController.updateProduct);

router.patch("/:productId/wishlist",validation(validators.wishList),auth(endPoint.addToWishList),productController.addToWishList);

router.patch("/:productId/wishlist/remove",validation(validators.wishList),auth(endPoint.addToWishList),productController.removeProductFromWishList);

export default router;