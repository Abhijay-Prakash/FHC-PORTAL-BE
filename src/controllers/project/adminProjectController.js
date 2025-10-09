import Project from "../../models/Project.js";


export const getPendingProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "pending" })
      .populate("owner", "name email class semester");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending projects", error });
  }
};


export const approveProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: "approved" },
      { new: true }
    );
    res.status(200).json({ message: "Project approved successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error approving project", error });
  }
};


export const rejectProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndUpdate(
      projectId,
      { status: "rejected" },
      { new: true }
    );
    res.status(200).json({ message: "Project rejected successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting project", error });
  }
};


export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("owner", "name email class")
      .populate("teamMembers", "name class semester");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};
