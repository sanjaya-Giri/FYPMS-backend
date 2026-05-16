import mongoose from "mongoose";
import { Project } from "./project.js";

const deadlineSchema = new mongoose.Schema(
    {
      name: {
           type: String,
           required: [true,"deadline name/title is required "],
           trim: true,
           maxlength: [
             1000,
             " message can not more than 1000 characters",
           ],
         },
    dueDate: {
      type:Date,
     
      required: [true, "due date is required"],
    },

    createdBy:{
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "created by is required"],
    },

     project:{
     type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default:null,
    },
       
  
  },
  {
    timestamps: true,
  }
);

// Indexing for better query performance
deadlineSchema.index({ dueDate: 1 });
deadlineSchema.index({ Project: 1 });
deadlineSchema.index({ createdBy: 1 });


export const Deadline =
  mongoose.models.Deadline || mongoose.model("Deadline", deadlineSchema);