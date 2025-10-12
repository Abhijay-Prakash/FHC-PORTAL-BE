import express from "express";
import {
  proposeProject,
  getApprovedProjects,
  requestToJoin,
  getMyProjects,
  getJoinRequests,
  respondToJoinRequest
} from "../../controllers/project/userProjectController.js";
import verifyUser from "../../middleware/protectRoute.js";


const router = express.Router();

router.post("/propose", verifyUser, proposeProject);
router.get("/approved", getApprovedProjects);
router.post("/join", verifyUser, requestToJoin);
router.get("/my-projects", verifyUser, getMyProjects);

router.get("/:projectId/requests", verifyUser, getJoinRequests);

router.put("/:projectId/requests/:requestId/respond", verifyUser, respondToJoinRequest);


export default router;
