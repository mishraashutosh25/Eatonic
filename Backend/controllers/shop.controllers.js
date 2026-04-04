import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const isProd = process.env.NODE_ENV === "production";
const safeError = (msg) => isProd ? "Something went wrong. Please try again." : msg;


export const createEditShop = async (req, res) => {
  try {
    const {
      id, name, city, state, area, address,
      shopType,
      cookingSpecialty, availableDays, mealTimes,
      deliveryType, maxOrdersPerDay,
      tiffinDailyPrice, tiffinWeeklyPrice, tiffinMonthlyPrice
    } = req.body;

    if (!name || !city || !state || !area || !address) {
      return res.status(400).json({ message: "Name, city, state, area and address are required" });
    }

    let image = null;
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      image = uploadedImage.secure_url;
    }

    // Build shared update data
    const commonData = {
      name, city, state, area, address,
      shopType: shopType || "restaurant",
    };

    // Home Chef specific fields
    if (shopType === "homechef") {
      commonData.cookingSpecialty = cookingSpecialty || "";
      commonData.bio = req.body.bio || "";
      commonData.whatsappNumber = req.body.whatsappNumber || "";
      commonData.availableDays = availableDays ? (Array.isArray(availableDays) ? availableDays : availableDays.split(",")) : ["Mon","Tue","Wed","Thu","Fri"];
      commonData.mealTimes = mealTimes ? (Array.isArray(mealTimes) ? mealTimes : mealTimes.split(",")) : ["Lunch","Dinner"];
      commonData.deliveryType = deliveryType || "Pickup Only";
      commonData.maxOrdersPerDay = Number(maxOrdersPerDay) || 10;
      commonData.servingTimings = {
        lunchStart:  req.body.lunchStart  || "12:00",
        lunchEnd:    req.body.lunchEnd    || "14:00",
        dinnerStart: req.body.dinnerStart || "19:00",
        dinnerEnd:   req.body.dinnerEnd   || "21:00",
      };
      commonData.tiffinPlans = {
        daily: Number(tiffinDailyPrice) || 0,
        weekly: Number(tiffinWeeklyPrice) || 0,
        monthly: Number(tiffinMonthlyPrice) || 0
      };
    }

    if (image) commonData.image = image;

    if (id) {
      await Shop.findByIdAndUpdate(id, commonData, { new: true });
    } else {
      if (!image) {
        return res.status(400).json({ message: "Image is required for a new shop" });
      }
      await Shop.create({ ...commonData, image, owner: req.userId });
    }

    const allShops = await Shop.find({ owner: req.userId }).populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } }
    ]).lean();
    return res.status(201).json(allShops);

  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};


export const getMyShop = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.userId }).populate("owner").populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    }).lean();
    return res.status(200).json(shops); // Now returns an array!
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { area } = req.query;

    let query = { city: { $regex: new RegExp(`^${city}$`, "i") } };
    if (area) {
      query.area = { $regex: new RegExp(`^${area}$`, "i") };
    }

    const shops = await Shop.find(query).populate("items").lean();

    if (!shops || shops.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

export const getHomeChefsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { area } = req.query;

    let query = {
      shopType: "homechef",
      city: { $regex: new RegExp(`^${city}$`, "i") }
    };
    if (area) {
      query.area = { $regex: new RegExp(`^${area}$`, "i") };
    }

    const chefs = await Shop.find(query).populate("owner", "fullname").populate("items").lean();
    return res.status(200).json(chefs);
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

export const getChefById = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId)
      .populate("owner", "fullname mobile")       // ← include mobile for WhatsApp
      .populate({ path: "items", options: { sort: { createdAt: -1 } } }).lean();

    if (!shop) return res.status(404).json({ message: "Chef / Shop not found" });
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

export const toggleShopStatus = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) return res.status(400).json({ message: "Shop ID is required" });

    const shopData = await Shop.findOne({ _id: shopId, owner: req.userId });
    if (!shopData) {
      return res.status(404).json({ message: "Shop not found or UNAUTHORIZED" });
    }

    await Shop.findByIdAndUpdate(
      shopData._id,
      { $set: { isOpen: !shopData.isOpen } }
    );
    
    // Return all shops to update UI natively
    const allShops = await Shop.find({ owner: req.userId }).populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } }
    ]).lean();
    return res.status(200).json(allShops);

  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};
export const deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Security: ensure shop belongs to this owner
    const shop = await Shop.findOne({ _id: shopId, owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found or unauthorized" });
    }

    // Delete all items that belong to this shop
    await Item.deleteMany({ shop: shopId });

    // Delete the shop itself
    await Shop.findByIdAndDelete(shopId);

    // Return remaining shops
    const allShops = await Shop.find({ owner: req.userId }).populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } }
    ]).lean();
    return res.status(200).json(allShops);

  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};

export const setFlashDeal = async (req, res) => {
  try {
    const { shopId, active, discount, durationHours, label } = req.body;
    if (!shopId) return res.status(400).json({ message: "shopId is required" });

    const shop = await Shop.findOne({ _id: shopId, owner: req.userId });
    if (!shop) return res.status(404).json({ message: "Shop not found or unauthorized" });

    let flashDealData;
    if (active) {
      // Start deal
      if (!discount || discount < 1 || discount > 90)
        return res.status(400).json({ message: "Discount must be between 1% and 90%" });
      if (!durationHours || durationHours < 0.5 || durationHours > 24)
        return res.status(400).json({ message: "Duration must be between 0.5 and 24 hours" });

      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
      flashDealData = { active: true, discount, expiresAt, startedAt: now, label: label || "Flash Deal" };
    } else {
      // Stop deal
      flashDealData = { active: false, discount: 0, expiresAt: null, startedAt: null, label: "" };
    }

    await Shop.findByIdAndUpdate(shopId, { $set: { flashDeal: flashDealData } });

    const allShops = await Shop.find({ owner: req.userId }).populate([
      { path: "owner" },
      { path: "items", options: { sort: { updatedAt: -1 } } }
    ]).lean();
    return res.status(200).json(allShops);

  } catch (error) {
    return res.status(500).json({ success: false, message: safeError(error.message) });
  }
};
