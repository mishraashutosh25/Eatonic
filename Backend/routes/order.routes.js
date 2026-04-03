import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getIncomingOrders,
  updateOrderStatus,
  getOrderStats
} from '../controllers/order.controllers.js';

const orderRouter = express.Router();

// ── User routes ──────────────────────────────────────────────
orderRouter.post("/place",                  isAuth, placeOrder);
orderRouter.get("/my-orders",               isAuth, getMyOrders);
orderRouter.patch("/cancel/:orderId",       isAuth, cancelOrder);

// ── Owner / Chef routes ──────────────────────────────────────
orderRouter.get("/incoming",                isAuth, getIncomingOrders);
orderRouter.patch("/update-status/:orderId",isAuth, updateOrderStatus);
orderRouter.get("/stats",                   isAuth, getOrderStats);

export default orderRouter;
