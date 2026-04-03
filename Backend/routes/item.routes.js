import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItem, deleteItem, editItem, getItemByCity, getItemById, toggleItemAvailability, toggleItemSpecial } from '../controllers/item.controllers.js';
import { upload } from '../middlewares/multer.js';


const itemRouter = express.Router();


itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);
itemRouter.delete("/delete/:itemId", isAuth, deleteItem);
itemRouter.patch("/toggle-availability/:itemId", isAuth, toggleItemAvailability);
itemRouter.patch("/toggle-special/:itemId", isAuth, toggleItemSpecial);
itemRouter.get("/get-by-city/:city", getItemByCity);

export default itemRouter;
