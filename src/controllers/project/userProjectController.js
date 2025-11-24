import Project from "../../models/Project.js";
import User from "../../models/User.js";




export const proposeProject = async (req, res) => {
  try {
    const { title, description, requiredSkills, tags, repoLink } = req.body;

    const project = new Project({
      title,
      description,
      requiredSkills,
      tags,
      repoLink,
      owner: req.user._id, // from auth middleware
    });

    await project.save();
    res.status(201).json({ message: "Project proposal submitted for approval.", project });
  } catch (error) {
    res.status(500).json({ message: "Error proposing project", error });
  }
};




export const getApprovedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "approved" })
      .populate("owner", "name class semester")
      .populate("teamMembers", "name class semester skills profilePic");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};









export const requestToJoin = async (req, res) => {
  try {
    const { projectId, message } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

  
    const alreadyRequested = project.joinRequests.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyRequested)
      return res.status(400).json({ message: "You already requested to join." });

    project.joinRequests.push({ user: req.user._id, message });
    await project.save();

    res.status(200).json({ message: "Join request sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error sending join request", error });
  }
};





export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate("teamMembers", "name class semester skills profilePic");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your projects", error });
  }
};


export const getProjectsAsTeamMember = async (req, res) => {
  try {
    const projects = await Project.find({
      teamMembers: req.user._id,
      owner: { $ne: req.user._id },
    })
      .populate("owner", "name class semester skills")
      .populate("teamMembers", "name class semester skills profilePic");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching team member projects", error });
  }
};





export const getJoinRequests = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("joinRequests.user", "name class semester skills profilePic");

    if (!project) return res.status(404).json({ message: "Project not found" });

    
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You are not the project owner." });
    }

    res.status(200).json(project.joinRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching join requests", error });
  }
};



export const respondToJoinRequest = async (req, res) => {
  try {
    const { projectId, requestId } = req.params;
    const { action } = req.body; 

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You are not the owner." });
    }

    const joinRequest = project.joinRequests.id(requestId);
    if (!joinRequest) {
      return res.status(404).json({ message: "Join request not found" });
    }

    if (joinRequest.status !== "pending") {
      return res.status(400).json({ message: "Request already responded to." });
    }

    if (action === "accept") {
      joinRequest.status = "accepted";
      project.teamMembers.push(joinRequest.user);
    } else if (action === "reject") {
      joinRequest.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'accept' or 'reject'." });
    }

    await project.save();
    res.status(200).json({ message: `Request ${action}ed successfully.`, project });
  } catch (error) {
    res.status(500).json({ message: "Error responding to join request", error });
  }
};
