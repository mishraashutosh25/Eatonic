import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true
    },

    items: [
      {
        item:  { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        name:  { type: String },
        price: { type: Number },
        qty:   { type: Number, default: 1 }
      }
    ],

    orderType: {
      type: String,
      enum: ["single", "tiffin"],
      default: "single"
    },

    // No enum restriction — just a plain optional string
    tiffinPlan: {
      type: String,
      default: ""
    },

    totalAmount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "ready", "delivered", "cancelled"],
      default: "pending"
    },

    deliveryAddress: {
      type: String,
      trim: true,
      default: ""
    },

    message: {
      type: String,
      trim: true,
      default: ""
    },

    chefNote: {
      type: String,
      trim: true,
      default: ""
    },

    estimatedDeliveryTime: {
      type: String,
      default: ""
    },

    statusHistory: [
      {
        status:    { type: String },
        updatedAt: { type: Date, default: Date.now },
        note:      { type: String, default: "" }
      }
    ]
  },
  { timestamps: true }
);

// Auto-generate order number using a counter approach
orderSchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      const count = await mongoose.model("Order").countDocuments();
      this.orderNumber = `#ORD-${String(count + 1).padStart(4, "0")}`;
      this.statusHistory = [{ status: "pending", updatedAt: new Date() }];
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
