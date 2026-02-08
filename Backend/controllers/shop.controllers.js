import Shop from "../models/shop.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    if (!name || !city || !state || !address) {
      return res.status(400).json({ message: "Name, state and address are required" });
    }

    let shop = await Shop.findOne({ owner: req.userId });

    let image = shop?.image || null;
    if (req.file) {
      console.log(req.file)
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      image = uploadedImage.secure_url;
    }

    if (!shop) {
      shop = await Shop.create({
        name, city, state, address, image, owner: req.userId
      });
    } else {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, city, state, address, image },
        { new: true }
      );
    }

    await shop.populate([
      { path: "owner" },
      { path: "items" }
    ]);
    return res.status(201).json(shop);

  } catch (error) {
    return res.status(500).json({
      message: "Create shop error",
      error: error.message
    });
  }
};


export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate("owner").populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json(shop);

  } catch (error) {
    return res.status(500).json({
      message: "Get My Shop  error",
      error: error.message
    });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    }).populate("items");

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "Shops not found" });
    }

    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({
      message: "Get Shop by city error",
      error: error.message
    });
  }
};




