import { Router } from "express";
import { uploadInstructorImage,uploadThumbnailImage , updateTextData, fetchAllDrafts,fetchById} from "../controller/courseDraft.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from '../middleware/auth.middleware.js'

const courseDraftRouter = Router();

courseDraftRouter.route("/uploadInstructorImage").put(verifyJWT, upload.fields([
  { name: "instructor_image_url", maxCount: 1 }]) , uploadInstructorImage);
courseDraftRouter.route("/uploadThumbnailImage").put(verifyJWT, upload.fields([
  { name: "thumbnail_image_url", maxCount: 1 }]) , uploadThumbnailImage);
courseDraftRouter.route("/updateTextData").put(verifyJWT, updateTextData);
courseDraftRouter.route("/fetchAllDrafts").put(verifyJWT, fetchAllDrafts);
courseDraftRouter.route("/fetchByCourseDraftId").put(verifyJWT, fetchById);

export { courseDraftRouter };