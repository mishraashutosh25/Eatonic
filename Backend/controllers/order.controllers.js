import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

const populated = (query) =>
  query
    .populate("user", "fullname mobile email")
    .populate("shop", "name image shopType")
    .populate("items.item", "name image price");

// ─── USER: Place Order ─────────────────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const { shopId, items, orderType, tiffinPlan, deliveryAddress, message, totalAmount } = req.body;

    if (!shopId)          return res.status(400).json({ message: "shopId is required" });
    if (!deliveryAddress) return res.status(400).json({ message: "Delivery address is required" });
    if (orderType === "single" && (!items || items.length === 0))
      return res.status(400).json({ message: "Select at least one item" });

    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const order = await Order.create({
      user: req.userId,
      shop: shopId,
      items: items || [],
      orderType: orderType || "single",
      tiffinPlan: tiffinPlan || "",
      deliveryAddress,
      message: message || "",
      totalAmount: totalAmount || 0,
    });

    const full = await populated(Order.findById(order._id));
    return res.status(201).json({ message: "Order placed!", order: full });
  } catch (error) {
    console.error("❌ placeOrder error:", error.message);
    return res.status(500).json({ message: "Place order error", error: error.message });
  }
};

// ─── USER: Get My Orders ───────────────────────────────────────────────────
export const getMyOrders = async (req, res) => {
  try {
    const orders = await populated(
      Order.find({ user: req.userId }).sort({ createdAt: -1 })
    );
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Get orders error", error: error.message });
  }
};

// ─── USER: Cancel Order ────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Only pending orders can be cancelled" });

    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", updatedAt: new Date(), note: "Cancelled by user" });
    await order.save();

    const orders = await populated(Order.find({ user: req.userId }).sort({ createdAt: -1 }));
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Cancel error", error: error.message });
  }
};

// ─── OWNER: Get Incoming Orders ────────────────────────────────────────────
export const getIncomingOrders = async (req, res) => {
  try {
    const myShops = await Shop.find({ owner: req.userId }).select("_id");
    const shopIds = myShops.map(s => s._id);

    const orders = await populated(
      Order.find({ shop: { $in: shopIds } }).sort({ createdAt: -1 })
    );
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Get incoming orders error", error: error.message });
  }
};

// ─── OWNER: Update Order Status ────────────────────────────────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, chefNote, estimatedDeliveryTime } = req.body;

    const validStatuses = ["accepted", "rejected", "ready", "delivered"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(orderId).populate("shop");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const shop = await Shop.findOne({ _id: order.shop._id, owner: req.userId });
    if (!shop) return res.status(403).json({ message: "Unauthorized" });

    order.status = status;
    if (chefNote !== undefined) order.chefNote = chefNote;
    if (estimatedDeliveryTime) order.estimatedDeliveryTime = estimatedDeliveryTime;
    order.statusHistory.push({
      status,
      updatedAt: new Date(),
      note: chefNote || ""
    });
    await order.save();

    // Return updated full list
    const myShops = await Shop.find({ owner: req.userId }).select("_id");
    const shopIds = myShops.map(s => s._id);
    const allOrders = await populated(
      Order.find({ shop: { $in: shopIds } }).sort({ createdAt: -1 })
    );
    return res.status(200).json(allOrders);
  } catch (error) {
    return res.status(500).json({ message: "Update order error", error: error.message });
  }
};

// ─── OWNER: Get Order Stats ────────────────────────────────────────────────
export const getOrderStats = async (req, res) => {
  try {
    const myShops = await Shop.find({ owner: req.userId }).select("_id");
    const shopIds = myShops.map(s => s._id);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, pendingOrders, allOrders] = await Promise.all([
      Order.countDocuments({ shop: { $in: shopIds } }),
      Order.countDocuments({ shop: { $in: shopIds }, createdAt: { $gte: todayStart } }),
      Order.countDocuments({ shop: { $in: shopIds }, status: "pending" }),
      Order.find({ shop: { $in: shopIds }, status: { $ne: "rejected" }, createdAt: { $gte: todayStart } }).select("totalAmount"),
    ]);

    const todayRevenue = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return res.status(200).json({ totalOrders, todayOrders, pendingOrders, todayRevenue });
  } catch (error) {
    return res.status(500).json({ message: "Stats error", error: error.message });
  }
};
