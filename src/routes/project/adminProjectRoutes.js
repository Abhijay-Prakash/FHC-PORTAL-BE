import express from "express";
import {
  getPendingProjects,
  approveProject,
  rejectProject,
  getAllProjects,
} from "../../controllers/project/adminProjectController.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

router.get("/pending", isAdmin, getPendingProjects);
router.put("/approve/:projectId", isAdmin, approveProject);
router.put("/reject/:projectId", isAdmin, rejectProject);
router.get("/all", isAdmin, getAllProjects);

export default router;
