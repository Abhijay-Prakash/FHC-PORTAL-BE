import express from "express";
import {
  getPendingProjects,
  approveProject,
  rejectProject,
  getAllProjects,
} from "../../controllers/project/adminProjectController.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import verifyUser from "../../middleware/protectRoute.js";

const router = express.Router();

router.get("/pending", verifyUser,isAdmin, getPendingProjects);
router.put("/approve/:projectId", verifyUser,isAdmin, approveProject);
router.put("/reject/:projectId", verifyUser,isAdmin, rejectProject);
router.get("/all", isAdmin, verifyUser,getAllProjects);

export default router;
