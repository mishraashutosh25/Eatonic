import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    if (!name || !city || !state || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
//       image = uploadedImage.secure_url;
    }
    let shop=await Shop.findOne({owner: req.userId})
    if(!shop){
        shop=await Shop.create({
                name,
      city,
      state,
      address,
      image,
      owner: req.userId
        })
    }else{
        shop=await Shop.findByIdAndUpdate(shop._id,{
                name,
      city,
      state,
      address,
      image,
      owner: req.userId
        },{new:true})
    }
    await shop.populate("owner");

    return res.status(201).json(shop);

  } catch (error) {
    return res.status(500).json({
      message: "Create shop error",
      error: error.message
    });
  }
};



