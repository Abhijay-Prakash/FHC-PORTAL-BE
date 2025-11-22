import express from "express";
import {
  proposeProject,
  getApprovedProjects,
  requestToJoin,
  getMyProjects,
  getJoinRequests,
  respondToJoinRequest
} from "../../controllers/project/userProjectController.js";
import {protectRoute} from "../../middleware/protectRoute.js";


const router = express.Router();

router.post("/propose", protectRoute, proposeProject);
router.get("/approved", protectRoute,getApprovedProjects);
router.post("/join", protectRoute, requestToJoin);
router.get("/my-projects", protectRoute, getMyProjects);

router.get("/:projectId/requests", protectRoute, getJoinRequests);

router.put("/:projectId/requests/:requestId/respond", protectRoute, respondToJoinRequest);


export default router;
