import { Router } from "express";
import { createCart, fetchCart, deleteCart, cartPresentOrNot } from "../controller/cart.controllers.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const cartRouter = Router();

cartRouter.route("/:userId/:courseId/createCart").post(verifyJWT, createCart);
cartRouter.route("/:userId/fetchingCart").put(verifyJWT, fetchCart);
cartRouter.route("/:userId/:courseId/delete").delete(verifyJWT, deleteCart);
cartRouter.route("/:userId/:courseId/check").put(verifyJWT, cartPresentOrNot);


export { cartRouter };
