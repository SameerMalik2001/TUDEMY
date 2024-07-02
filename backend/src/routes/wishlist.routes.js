import { Router } from "express";
import { createWishlist, deleteWishlist, fetchWishlist, wishlistPresentOrNot } from "../controller/wishlist.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const wishlistRouter = Router();

wishlistRouter.route("/:userId/:courseId/createWishlist").post(verifyJWT, createWishlist);
wishlistRouter.route("/:userId/fetchWishlist").put(verifyJWT, fetchWishlist);
wishlistRouter.route("/:userId/:courseId/delete").delete(verifyJWT, deleteWishlist);
wishlistRouter.route("/:userId/:courseId/check").put(verifyJWT, wishlistPresentOrNot);


export { wishlistRouter };
