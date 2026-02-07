import { populate } from "dotenv";
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const addItem = async (req, res) => {
        try {
                const { name, category, foodType, price } = req.body;

                let image;
                if (req.file) {
                        const uploadResult = await uploadOnCloudinary(req.file.path);
                        image = uploadResult.secure_url;
                }

                const shop = await Shop.findOne({ owner: req.userId })
                if (!shop) {
                        return res.status(400).json({ message: "shop not found" });
                }

                const item = await Item.create({
                        name,
                        category,
                        foodType,
                        price,
                        image,
                        shop: shop._id,
                });

                shop.items.push(item._id)
                await shop.save()
                await shop.populate("owner")
                await shop.populate({
                                path: "items",
                                options: { sort: { updatedAt: -1 } }
                        })
                return res.status(201).json(shop);

        } catch (error) {
                return res.status(500).json({
                        message: error.message
                });
        }
};

export const editItem = async (req, res) => {
        try {
                const { itemId } = req.params;
                const { name, category, foodType, price } = req.body;


                const updateData = {
                        name,
                        category,
                        foodType,
                        price,
                };


                if (req.file) {
                        const uploadResult = await uploadOnCloudinary(req.file.path);
                        updateData.image = uploadResult.secure_url;
                }


                const item = await Item.findByIdAndUpdate(
                        itemId,
                        updateData,
                        { new: true }
                );

                if (!item) {
                        return res.status(404).json({ message: "Item not found" });
                }


                const shop = await Shop.findOne({ owner: req.userId }).populate({
                        path: "items",
                        options: { sort: { updatedAt: -1 } }
                });

                return res.status(200).json(shop);

        } catch (error) {
                console.error("EDIT ITEM ERROR:", error);
                return res.status(500).json({ message: error.message });
        }
};

export const getItemById = async (req, res) => {
        try {
                const itemId = req.params.itemId
                const item = await Item.findById(itemId)
                if (!item) {
                        return res.status(400).json({ message: "item not found" })
                }
                return res.status(200).json(item)
        } catch (error) {
                return res.status(500).json({ message: `Get item eroor ${error}` })
        }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.items = shop.items.filter(
      i => i.toString() !== item._id.toString()
    );

    await shop.save();

    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);

  } catch (error) {
    console.error("DELETE ITEM ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};
