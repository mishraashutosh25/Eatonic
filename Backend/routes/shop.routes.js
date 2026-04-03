import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createEditShop, deleteShop, getChefById, getHomeChefsByCity, getMyShop, getShopByCity, setFlashDeal, toggleShopStatus } from '../controllers/shop.controllers.js';
import { upload } from '../middlewares/multer.js';


const shopRouter = express.Router();


shopRouter.post("/create-edit", isAuth, upload.single("image"), createEditShop);
shopRouter.get("/get-my", isAuth, getMyShop)
shopRouter.get("/get-by-city/:city", getShopByCity)
shopRouter.get("/home-chefs/:city", getHomeChefsByCity)
shopRouter.get("/chef/:shopId", getChefById)
shopRouter.put("/toggle-status", isAuth, toggleShopStatus)
shopRouter.delete("/delete/:shopId", isAuth, deleteShop)
shopRouter.put("/flash-deal", isAuth, setFlashDeal)


export default shopRouter;


