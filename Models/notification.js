import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user Id is required"],
    },
     message: {
          type: String,
          required: [true,"message is required "],
          trim: true,
          maxlength: [
            1000,
            " message can not more than 1000 characters",
          ],
        },
        isRead:{
            type:Boolean,
            default:false
        },
        link:{
            type:String,
            default:null
        },
        type:{
            type:String,
            enum:[
                "request",
                "approval",
                "rejection",
                "feedback",
                "deadline",
                "general",
                "meeting",
                "system"
            ],
            default:"general"
        },
     priority:{
            type:String,
            enum:["high","medium","low"],
            default:"low"
        }

  
  },
  {
    timestamps: true,
  }
);

// Indexing for better query performance
notificationSchema.index({ user: 1 });
notificationSchema.index({ isRead: 1 });


export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);