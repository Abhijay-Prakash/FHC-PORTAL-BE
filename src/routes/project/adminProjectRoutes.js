import express from "express";
import {
  getPendingProjects,
  approveProject,
  rejectProject,
  getAllProjects,
} from "../../controllers/project/adminProjectController.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import {protectRoute} from "../../middleware/protectRoute.js";

const router = express.Router();

router.get("/pending", protectRoute,isAdmin, getPendingProjects);
router.put("/approve/:projectId", protectRoute,isAdmin, approveProject);
router.put("/reject/:projectId", protectRoute,isAdmin, rejectProject);
router.get("/all",  protectRoute,isAdmin.apply,getAllProjects);

export default router;
