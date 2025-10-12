import express from "express";
import {
  proposeProject,
  getApprovedProjects,
  requestToJoin,
  getMyProjects,
} from "../../controllers/project/userProjectController.js";
import verifyUser from "../../middleware/protectRoute.js";

const router = express.Router();

router.post("/propose", verifyUser, proposeProject);
router.get("/approved", getApprovedProjects);
router.post("/join", verifyUser, requestToJoin);
router.get("/my-projects", verifyUser, getMyProjects);

export default router;
