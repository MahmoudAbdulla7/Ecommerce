import { asyncHandler } from "../../../utils/errorHandling.js";
import Coupon from "../../../../DB/model/Coupon.model.js";
import Cart from "../../../../DB/model/Cart.model.js";
import Product from "../../../../DB/model/Product.js";
import Order from "../../../../DB/model/Order.model.js";
import {
  clearAllItems,
  deleteItemsFromCart,
} from "../../cart/controller/cart.js";
import createInvoice from "../../../utils/pdfkit.js";
import sendEmail from "../../../utils/email.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  const { address, phone, couponName, paymentType, note } = req.body;

  if (!req.body.products) {
    const cart = await Cart.findOne({ createdBy: req.user._id });
    if (!cart?.products?.length) {
      return next(new Error("cart does not exist", { cayse: 404 }));
    }
    req.body.isCart = true;
    req.body.products = cart.products;
  }

  if (couponName) {
    const coupon = await Coupon.findOne({
      name: couponName.toLowerCase(),
      usedBy: { $nin: req.user._id },
    });

    if (!coupon) {
      return next(new Error("in-valid coupon", { cause: 400 }));
    }

    if (coupon.expireDate?.getTime() < Date.now()) {
      return next(new Error("expired coupon date", { cause: 400 }));
    }
    req.body.coupon = coupon;
  }

  const productsList = [];
  let productIds = [];
  let subTotal;
  for (let product of req.body.products) {
    const checkProduct = await Product.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
      isDeleted: false,
    });
    if (!checkProduct) {
      return next(new Error("in-valid product", { cause: 400 }));
    }
    if (req.body.isCart) {
      //BSON ==> Object
      product = product.toObject();
    }
    product.name = checkProduct.name;
    product.unitPrice = checkProduct.finalPrice;
    product.finalPrice = (product.quantity * checkProduct.finalPrice).toFixed(
      2
    );
    productsList.push(product);
    productIds.push(product.productId);
    subTotal = +product.finalPrice;

    await Product.updateOne(
      { _id: product.productId },
      { $inc: { stock: -parseInt(product.quantity) } }
    );
  }

  if (req.body.coupon) {
    await Coupon.updateOne(
      { _id: req.body.coupon._id },
      { $addToSet: { usedBy: req.user._id } }
    );
  }

  if (req.body.isCart) {
    await clearAllItems(req.user._id);
  } else {
    await deleteItemsFromCart(req.user._id, productIds);
  }

  const dummyOrder = {
    userId: req.user._id,
    address,
    phone,
    note,
    products: productsList,
    subTotal,
    couponId: req.body.coupon?._id,
    finalPrice: (
      subTotal - ((subTotal * req.body.coupon?.amount) / 100 || 0)
    ).toFixed(2),
    paymentType,
    status: paymentType ? "waitPayment" : "placed",
  };

  const order = await Order.create(dummyOrder);
  if (!order) {
    return next(new Error("faild to create order ", { cause: 500 }));
  }

  const invoice = {
    shipping: {
      name: req.user.userName,
      address: order.address,
      city: "Cairo",
      state: "Cairo",
      country: "Egypt",
      postal_code: 94111,
    },
    items: order.products,
    subTotal: subTotal,
    total: order.finalPrice,
    invoice_nr: order._id,
    date: order.createdAt,
  };

  await createInvoice(invoice, "invoice.pdf");
  if (
    await sendEmail({
      to: req.user.email,
      subject: "invoice",
      attachments: [
        {
          path: "./Files/invoice.pdf",
          contentType: "application/pdf",
        },
      ],
    })
  ) {
    return res.status(200).json({ message: "Done", order });
  }
  return next(new Error("erro for sending unvoice",{cause:400}));
});

export const cancelOrder = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, userId: req.user._id });

  if (!order) {
    return next(new Error("you have not order", { cause: 404 }));
  }

  if (order.status == "canceled") {
    return next(new Error(`order is already canceled `, { cause: 400 }));
  }

  if (
    (order.status !== "placed" && order.paymentType == "cash") ||
    (order.status !== "waitPayment" && order.paymentType == "card")
  ) {
    return next(
      new Error(
        `can not cancel your order after it has been changed to ${order.status} `,
        { cause: 400 }
      )
    );
  }

  const canceledOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    { status: "canceled", reason, updatedBy: req.user._id }
  );
  if (canceledOrder.matchedCount == 0) {
    return next(new Error(`fail to cancel your order `, { cause: 400 }));
  }

  for (const product of order.products) {
    await Product.updateOne(
      { _id: product.productId },
      { $inc: { stock: parseInt(product.quantity) } }
    );
  }

  if (order.couponId) {
    await Coupon.updateOne(
      { _id: order.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }

  res.status(200).json({ message: "Done" });
});

export const updateOrderStatusByAdmin = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    return next(new Error("you have not order", { cause: 404 }));
  }

  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    { status, updatedBy: req.user._id }
  );
  if (updatedOrder.matchedCount == 0) {
    return next(new Error(`fail to update this order `, { cause: 400 }));
  }

  res.status(200).json({ message: "Done", updatedOrder });
});
