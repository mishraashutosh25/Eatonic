import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    city: {
      type: String,
      required: true,
      trim: true
    },

    area: {
      type: String,
      required: true,
      trim: true
    },

    state: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],

    isOpen: {
      type: Boolean,
      default: true
    },

    // ===== SHOP TYPE =====
    shopType: {
      type: String,
      enum: ["restaurant", "homechef"],
      default: "restaurant"
    },

    // ===== HOME CHEF SPECIFIC FIELDS =====
    cookingSpecialty: {
      type: String,
      trim: true,
      default: ""
    },

    bio: {
      type: String,
      trim: true,
      maxLength: 300,
      default: ""     // e.g. "Been cooking for 20 years, specialise in home-style North Indian"
    },

    whatsappNumber: {
      type: String,
      trim: true,
      default: ""     // optional — chef can add a separate WhatsApp number
    },

    servingTimings: {
      lunchStart:  { type: String, default: "12:00" },
      lunchEnd:    { type: String, default: "14:00" },
      dinnerStart: { type: String, default: "19:00" },
      dinnerEnd:   { type: String, default: "21:00" }
    },

    availableDays: {
      type: [String],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    },

    mealTimes: {
      type: [String],
      enum: ["Breakfast", "Lunch", "Dinner"],
      default: ["Lunch", "Dinner"]
    },

    deliveryType: {
      type: String,
      enum: ["Pickup Only", "Nearby Delivery", "Both"],
      default: "Pickup Only"
    },

    maxOrdersPerDay: {
      type: Number,
      default: 10
    },

    tiffinPlans: {
      daily: { type: Number, default: 0 },    // price per day
      weekly: { type: Number, default: 0 },   // price per week (5 days)
      monthly: { type: Number, default: 0 }   // price per month (22 days)
    },

    // ===== FLASH DEAL =====
    flashDeal: {
      active: { type: Boolean, default: false },
      discount: { type: Number, default: 0 },
      expiresAt: { type: Date, default: null },
      startedAt: { type: Date, default: null },
      label: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;

