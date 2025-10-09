import express from "express";
import {
  getPendingProjects,
  approveProject,
  rejectProject,
  getAllProjects,
} from "../../controllers/project/adminProjectController.js";
import { verifyAdmin } from "../../middleware/protectRoute.js";

const router = express.Router();

router.get("/pending", verifyAdmin, getPendingProjects);
router.put("/approve/:projectId", verifyAdmin, approveProject);
router.put("/reject/:projectId", verifyAdmin, rejectProject);
router.get("/all", verifyAdmin, getAllProjects);

export default router;
