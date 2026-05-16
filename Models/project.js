import mongoose from "mongoose";

const feedbackSchema=new mongoose.Schema({
   supervisorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        type: {
          type: String,
          enum: ["positive", "negative", "general"],
          default: "general",
        },

        title: {
          type: String,
          required: true,
          trim: true,
        },

        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: [
            1000,
            "Feedback message can not more than 1000 characters",
          ],
        },
},{timestamps:true})

const projectSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "student Id is required"],
    },

    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: [true, "project title is required"],
      trim: true,
      maxlength: [200, "Title can not more than 200 characters"],
    },

    description: {
      type: String,
      required: [true, "project description is required"],
      trim: true,
      maxlength: [1000, "Description can not more than 1000 characters"],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    files: [
      {
        fileType: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        uploadAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    feedback: [feedbackSchema],
  

    deadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for better query performance
projectSchema.index({ student: 1 });
projectSchema.index({ supervisor: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ title: "text", description: "text" });

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);