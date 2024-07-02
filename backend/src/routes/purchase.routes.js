import { Router } from "express";
import { createPurchase,studentCount } from "../controller/purchase.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const purchaseRouter = Router();

purchaseRouter.route("/:courseId/createPurchase").post(verifyJWT, createPurchase);

purchaseRouter.route("/:courseId/studentCount").put(verifyJWT ,studentCount);


export { purchaseRouter };