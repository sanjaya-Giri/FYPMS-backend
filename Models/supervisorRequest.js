import mongoose from "mongoose";


const supervisorRequestSchema = new mongoose.Schema(
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true,"student id is required"]

         },
         supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:[true,"supervisor id is required"]

         },
    message:{
        type:String,
        required:[true,"Message requred"],
        trim:true,
        maxlength:[250,"message can not more than 250 charecters"]
    },
    status:{
        type:String,
        default:"pending",
        enum:["pending","accepted","rejected"]

    }
       
  
  },
  {
    timestamps: true,
  }
);

// Indexing for better query performance
supervisorRequestSchema.index({ student: 1 });
supervisorRequestSchema.index({ supervisor: 1 });
supervisorRequestSchema.index({ status: 1 });


export const SupervisorRequest =
  mongoose.models.SupervisorRequest || mongoose.model("SupervisorRequest", supervisorRequestSchema);