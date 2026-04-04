import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const isProd = process.env.NODE_ENV === "production";
const safeError = (msg) => isProd ? "Something went wrong. Please try again." : msg;


export const addItem = async (req, res) => {
        try {
                const { shopId, name, description, category, foodType, price } = req.body;

                if (!shopId) return res.status(400).json({ message: "shopId is required" });

                let image;
                if (req.file) {
                        const uploadResult = await uploadOnCloudinary(req.file.path);
                        image = uploadResult.secure_url;
                }

                const shopData = await Shop.findOne({ _id: shopId, owner: req.userId })
                if (!shopData) {
                        return res.status(400).json({ message: "shop not found or unauthorized" });
                }

                const item = await Item.create({
                        name,
                        description: description || "",
                        category,
                        foodType,
                        price,
                        image,
                        shop: shopData._id,
                });

                await Shop.findByIdAndUpdate(
                        shopData._id,
                        { $push: { items: item._id } }
                )

                const allShops = await Shop.find({ owner: req.userId }).populate([
                        { path: "owner" },
                        { path: "items", options: { sort: { updatedAt: -1 } } }
                ]);

                return res.status(201).json(allShops);

        } catch (error) {
                return res.status(500).json({ success: false, message: safeError(error.message) });
        }
};

export const editItem = async (req, res) => {
        try {
                const { itemId } = req.params;
                const { name, description, category, foodType, price } = req.body;


                const updateData = {
                        name,
                        description: description || "",
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

                const allShops = await Shop.find({ owner: req.userId }).populate([
                        { path: "owner" },
                        { path: "items", options: { sort: { updatedAt: -1 } } }
                ]);

                return res.status(200).json(allShops);

        } catch (error) {
                return res.status(500).json({ success: false, message: safeError(error.message) });
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
                return res.status(500).json({ success: false, message: safeError(error.message) });
        }
};

export const deleteItem = async (req, res) => {
        try {
                const { itemId } = req.params;

                const item = await Item.findByIdAndDelete(itemId);
                if (!item) {
                        return res.status(404).json({ message: "Item not found" });
                }

                const shopData = await Shop.findOne({ _id: item.shop, owner: req.userId });
                if (shopData) {
                        await Shop.findByIdAndUpdate(
                                shopData._id,
                                { $pull: { items: item._id } }
                        )
                }

                const allShops = await Shop.find({ owner: req.userId }).populate([
                        { path: "owner" },
                        { path: "items", options: { sort: { updatedAt: -1 } } }
                ]);

                return res.status(200).json(allShops);

        } catch (error) {
                return res.status(500).json({ success: false, message: safeError(error.message) });
        }
};

export const getItemByCity = async (req, res) => {
        try {
                const { city } = req.params;
                const { area } = req.query;
                if (!city) {
                        return res.status(400).json({ message: "city is required" })
                }
                
                let query = { city: { $regex: new RegExp(`^${city}$`, "i") } };
                if (area) {
                        query.area = { $regex: new RegExp(`^${area}$`, "i") };
                }

                const shops = await Shop.find(query).populate("items");

                if (!shops || shops.length === 0) {
                        return res.status(200).json([]);
                }
                const shopIds = shops.map((shop) => shop._id)

                const items = await Item.find({ shop: { $in: shopIds } })
                return res.status(200).json(items)
        } catch (error) {
                return res.status(500).json({ success: false, message: safeError(error.message) });
        }
};

export const toggleItemAvailability = async (req, res) => {
        try {
                const { itemId } = req.params;
                const item = await Item.findById(itemId);
                if (!item) {
                        return res.status(404).json({ message: "Item not found" });
                }

                // Security check — item's shop must belong to this owner
                const shop = await Shop.findOne({ _id: item.shop, owner: req.userId });
                if (!shop) {
                        return res.status(403).json({ message: "Unauthorized" });
                }

                await Item.findByIdAndUpdate(itemId, { $set: { isAvailable: !item.isAvailable } });

                const allShops = await Shop.find({ owner: req.userId }).populate([
                        { path: "owner" },
                        { path: "items", options: { sort: { updatedAt: -1 } } }
                ]);
                return res.status(200).json(allShops);
        } catch (error) {
                return res.status(500).json({ success: false, message: safeError(error.message) });
        }
};

export const toggleItemSpecial = async (req, res) => {
        try {
                const { itemId } = req.params;
                const item = await Item.findById(itemId);
                if (!item) return res.status(404).json({ message: "Item not found" });

                const shop = await Shop.findOne({ _id: item.shop, owner: req.userId });
                if (!shop) return res.status(403).json({ message: "Unauthorized" });

                // If marking as special → first unmark all others in same shop
                if (!item.isSpecial) {
                        await Item.updateMany({ shop: item.shop, isSpecial: true }, { $set: { isSpecial: false } });
                }

                await Item.findByIdAndUpdate(itemId, { $set: { isSpecial: !item.isSpecial } });

                const allShops = await Shop.find({ owner: req.userId }).populate([
                        { path: "owner" },
                        { path: "items", options: { sort: { updatedAt: -1 } } }
                ]);
                return res.status(200).json(allShops);
        } catch (error) {
                return res.status(500).json({ success: false, message: safeError(error.message) });
        }
};
