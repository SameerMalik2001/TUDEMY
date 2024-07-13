import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
  origin: 'https://tudemy.vercel.app',
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser())

// import routes
import { userRouter } from "./routes/user.routes.js";
import { courseRouter } from "./routes/course.routes.js";
import { vidoeRouter } from './routes/video.routes.js';
import { purchaseRouter } from './routes/purchase.routes.js';
import { paymentRouter } from './routes/payment.routes.js'
import { cartRouter } from './routes/cart.routes.js'
import { wishlistRouter } from './routes/wishlist.routes.js';
import { reviewRouter } from './routes/review.routes.js';
import { courseDraftRouter } from './routes/courseDraft.routes.js';

//route declaration
app.use("/api/users/", userRouter);
app.use("/api/courses/", courseRouter);
app.use("/api/videos/", vidoeRouter);
app.use("/api/purchases/", purchaseRouter);
app.use("/api/payments/", paymentRouter);
app.use("/api/carts/", cartRouter);
app.use("/api/wishlists/", wishlistRouter);
app.use("/api/reviews/", reviewRouter);
app.use("/api/coursedrafts/", courseDraftRouter);

export { app };
