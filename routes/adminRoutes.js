import express from "express";

import { isAuthenticated,isAuthorized } from "../middlewares/authMiddleware.js";

import { assignSupervisor, createStudent, createTeacher, deleteStudent, deleteTeacher, getAllProject, getAllUser, getDashBoardStats, getProject, upadateStudent, upadateTeacher, updateProjectStatus } from "../controllers/adminController.js";

const router = express.Router();

router.post(
  "/create-student",
  isAuthenticated,
  isAuthorized("Admin"),
  createStudent,
);
router.put(
  "/update-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upadateStudent,
);
router.delete(
  "/delete-student/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteStudent,
);

router.post(
  "/create-teacher",
  isAuthenticated,
  isAuthorized("Admin"),
  createTeacher,
);
router.put(
  "/update-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  upadateTeacher,
);
router.delete(
  "/delete-teacher/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  deleteTeacher,
);
router.get(
  "/users",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllUser,
);


router.get(
  "/projects",
  isAuthenticated,
  isAuthorized("Admin"),
  getAllProject,
);

router.get(
  "/dashboard-stats",
  isAuthenticated,
  isAuthorized("Admin"),
  getDashBoardStats,
);

router.post(
  "/assign-supervisor",
  isAuthenticated,
  isAuthorized("Admin"),
  assignSupervisor)
router.get(
  "/project/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  getProject)
router.put(
  "/project/:id",
  isAuthenticated,
  isAuthorized("Admin"),
  updateProjectStatus)
export default router;
