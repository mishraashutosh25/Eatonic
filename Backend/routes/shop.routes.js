import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createEditShop } from '../controllers/shop.controllers.js';
import { upload } from '../middlewares/multer.js';


const shopRouter = express.Router();


shopRouter.get("/create-edit", isAuth,upload.single("image"),createEditShop);



export default shopRouter;