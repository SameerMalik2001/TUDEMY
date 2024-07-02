import { Router } from "express";
import { uploadVideo, fetchAllVideosByCourseIdLogout,updateForVideoNotNullIdNull, fetchAllVideosByCourseId,updateForVideoNullIdNull, updateVideoBothNotNull, updateForVideoNullIdNotNull, deleteById } from "../controller/video.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from '../middleware/auth.middleware.js'

const vidoeRouter = Router();

vidoeRouter.route("/updateForVideoNullIdNull").put(verifyJWT, updateForVideoNullIdNull); //good
vidoeRouter.route("/updateForVideoNotNullIdNull").put(verifyJWT, 
  upload.fields([
    {name: 'video', maxCount: 1}
  ]), 
  updateForVideoNotNullIdNull
);
vidoeRouter.route("/:courseId/uploadOneVideo").post(
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  uploadVideo
);

vidoeRouter.route("/:courseId/logout").get(fetchAllVideosByCourseIdLogout)

vidoeRouter.route("/:videoId/updateVideoBothNotNull").put(verifyJWT,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateVideoBothNotNull
); // good
vidoeRouter.route("/:videoId/updateForVideoNullIdNotNull").put(verifyJWT, updateForVideoNullIdNotNull); // good
vidoeRouter.route("/:videoId/deleteById").delete(verifyJWT, deleteById);
vidoeRouter.route("/:courseId").put(verifyJWT, fetchAllVideosByCourseId)


export { vidoeRouter };
