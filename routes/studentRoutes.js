import express from "express";

import { isAuthenticated,isAuthorized } from "../middlewares/authMiddleware.js";

import { getStudentProject,getAvailbaleSupervisor,submitProposal,uploadFiles, getSupervisor, requestSupervisor, getFeedback, getDashboardStats, downloadFile } from "../controllers/studentController.js";
import { handleUploadError,upload } from "../middlewares/upload.js";
import muter from "multer"

const router = express.Router();

router.post(
  "/project",
  isAuthenticated,
  isAuthorized("Student"),
  getStudentProject,
);
router.post(
  "/project-proposal",
  isAuthenticated,
  isAuthorized("Student"),
  submitProposal,
);
router.post(
  "/upload/:projectId",
  isAuthenticated,
  isAuthorized("Student"),
 upload.array("files",10),
  handleUploadError,
  uploadFiles
);

router.get(
  "/fetch-supervisor",
  isAuthenticated,
  isAuthorized("Student"),
  getAvailbaleSupervisor,
);

router.get(
  "/supervisor",
  isAuthenticated,
  isAuthorized("Student"),
  getSupervisor,
);

router.post(
  "/request-supervisor",
  isAuthenticated,
  isAuthorized("Student"),
  requestSupervisor,
);

router.get("/feedback/:projectId",
  isAuthenticated,
  isAuthorized("Student"),
  getFeedback
)

router.get("/fetch-dashboard-stats",
  isAuthenticated,
  isAuthorized("Student"),
  getDashboardStats
)

router.get("/download/:projectId/:fileId",
  isAuthenticated,
  isAuthorized("Student"),
  downloadFile
)
export default router;
