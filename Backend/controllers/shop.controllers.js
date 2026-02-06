import Shop from "../models/shop.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    if (!name || !state || !address) {
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

    await shop.populate("owner,item");
    return res.status(201).json(shop);

  } catch (error) {
    return res.status(500).json({
      message: "Create shop error",
      error: error.message
    });
  }
};


export const getMyShop= async(req,res)=>{
  try{
const shop=await Shop.findOne({owner:req.userId}).populate("owner items");
if(!shop){
  return null
}
return res.status(200).json(shop);

  }catch(error){
    return res.status(500).json({
      message: "Get My Shop  error",
      error: error.message
    });
  }
}



