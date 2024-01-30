import { Router } from "express";
import * as cartController from "./controller/cart.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./cart.endPoint.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./cart.validation.js";

const router = Router()

router.post('/',validation(validators.createCart),auth(endPoint.create), cartController.createCart);

router.patch('/remove',validation(validators.deleteItems),auth(endPoint.create), cartController.deleteItems);

router.patch('/empty-cart',auth(endPoint.create), cartController.emptyCart);




export default router