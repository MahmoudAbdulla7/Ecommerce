import { Router } from "express";
import * as orderController from "./controller/order.js";
import {auth} from '../../middleware/auth.js';
import { endPoint } from "./order.endPoint.js";
import {validation} from '../../middleware/validation.js';
import * as validator from './order.validation.js';

const router = Router();

router.post('/',validation(validator.createOrder),auth(endPoint.create), orderController.createOrder);

router.patch('/:orderId',validation(validator.cancel),auth(endPoint.cancel), orderController.cancelOrder);

router.patch('/update-status/:orderId',validation(validator.update),auth(endPoint.update), orderController.updateOrderStatusByAdmin);

export default router;