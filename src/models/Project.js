import mongoose from "mongoose";
import { SKILLS_ENUM } from "./User.js";


const projectSchema = new mongoose.Schema({
  
  title: { type: String, required: true },
  description: { type: String, required: true },

 
  requiredSkills: [
    {
      type: String,
      enum: SKILLS_ENUM,
      required: true,
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],


  joinRequests: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String, // optional "why I want to join"
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      requestedAt: { type: Date, default: Date.now },
    },
  ],

  
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  
  tags: [String],

  
  repoLink: { type: String },


  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});


projectSchema.index({ status: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ requiredSkills: 1 });

export default mongoose.model("Project", projectSchema);
