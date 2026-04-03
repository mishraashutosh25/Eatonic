import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      maxLength: 200,
      default: ""
    },

    image: {
      type: String,
      required: true
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shop"
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Fast Food",
        "Bakery",
        "Snacks",        
        "South Indian",
        "North Indian",
        "Chinese",
        "Biryani",
        "Rolls",
        "Pizza",
        "Burger",
        "Sandwich",
        "Others"
      ]
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    foodType: {
      type: String,
      required: true,
      enum: ["Veg", "Non-Veg", "Vegan"]
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    isSpecial: {
      type: Boolean,
      default: false    // Owner can mark one item as "Today's Special"
    },
    rating:{
average:{type:Number,default:0},
count:{type:Number,default:0}

    }

  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
