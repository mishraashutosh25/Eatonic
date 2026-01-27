import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


const uploadOnCloudinary = async (file) => {
        // Configuration
        cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.envCLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
        });
        try {
                const res = await cloudinary.uploader.upload(file)
                fs.unlinkSync(file)
                return res.secure_url
        } catch (error) {
                fs.unlinkSync(file)
                console.log(error)

        }


}

export default cloudinary;