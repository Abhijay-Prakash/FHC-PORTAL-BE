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
      .populate("teamMembers", "name class semester skills");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your projects", error });
  }
};
