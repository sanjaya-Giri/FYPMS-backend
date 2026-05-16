import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../Models/user.js";
import * as userServices from "../services/userServices.js";
import * as projectService from "../services/projectService.js";
import * as requestService from "../services/requestServices.js";
import * as notificationService from "../services/notificationServices.js";
import * as fileServices from "../services/fileServices.js";
import { Project } from "../Models/project.js";
import { Notification } from "../Models/notification.js";
import { SupervisorRequest } from "../Models/supervisorRequest.js";
import { sendEmail } from "../services/emailService.js";
import { generateRequestAcceptedTemplate, generateRequestRejectedTemplate } from "../utils/emailTemplate.js";

export const getTeacherDashboardStats = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;
  const totalPendingRequests = await SupervisorRequest.countDocuments({
    supervisor: teacherId,
    status: "pending",
  });

  const completedProjects = await Project.countDocuments({
    supervisor: teacherId,
    status: "completed",
  });

  const recentNotifications = await Notification.find({ user: teacherId })
    .sort({ createdAt: -1 })
    .limit(5);

  const dashboardStats = {
    totalPendingRequests,
    completedProjects,
    recentNotifications,
  };

  res.status(200).json({
    success: true,
    message: "Dashboard stats fetched successfully",
    data: {
      dashboardStats,
    },
  });
});

export const getRequests = asyncHandler(async (req, res, next) => {
  const { supervisor } = req.query;

  const filters = {};
  if (supervisor) {
    filters.supervisor = supervisor;
  }
  const { requests, total } = await requestService.getAllRequests(filters);

  const updatedRequests = await Promise.all(
    requests.map(async (reqObj) => {
      const requestsObject = reqObj.toObject() ? reqObj.toObject() : reqObj;
      if (requestsObject?.student?._id) {
        const latestProject = await Project.findOne({
          student: requestsObject.student._id,
        })
          .sort({ createdAt: -1 })
          .lean();

        return { ...requestsObject, latestProject };
      }
      return requestsObject;
    }),
  );
  res.status(200).json({
    success: true,
    message: "Requests fetched successfully",
    data: {
      requests: updatedRequests,
      total,
    },
  });
});

export const acceptRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;

  const teacherId = req.user._id;

  const request = await requestService.acceptRequest(requestId, teacherId);
  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }
  await notificationService.notifyUser(
    request.student._id,
    `${request.supervisor.name} has accepted your supervisor request`,
    "approval",
    "/student/status",
    "low",
  );

  const student = await User.findById(request.student._id);
  const studentEmail = student.email;

  const message = generateRequestAcceptedTemplate(req.user.name);
  await sendEmail({
    to: studentEmail,
    subject: "Supervisor Request Accepted",
    message,
  });

  res.status(200).json({
    success: true,
    message: "Request accepted successfully",
    data: { request },
  });
});

export const rejectRequest = asyncHandler(async (req, res, next) => {
      const { requestId } = req.params;

  const teacherId = req.user._id;

  const request = await requestService.rejectRequest(requestId, teacherId);
  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }
    await notificationService.notifyUser(
    request.student._id,
    `${request.user.name} has rejected your supervisor request`,
    "rejection",
    "/student/status",
    "high",
  );

  const student = await User.findById(request.student._id);
  const studentEmail = student.email;

  const message = generateRequestRejectedTemplate(req.user.name);
  await sendEmail({
    to: studentEmail,
    subject: "Supervisor Request rejected",
    message,
  });

    res.status(200).json({
    success: true,
    message: "Request rejcted",
    data: { request },
  });


});



export const getAssignedStudents = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;

  const students =await User.find({ supervisor: teacherId })
    .populate("project")
    .sort({ createdAt: -1 });
   
    

  const total=await User.countDocuments({supervisor:teacherId})

  res.status(200).json({
    success: true,
    data: {
      students,
      total,
    },
  });
});


export const markComplete=asyncHandler(async(req,res,next)=>{
  const {projectId}=req.params;
  const teacherId=req.user._id;

  const project=await projectService.getProjectById(projectId);

  if(!project){
    return next(new ErrorHandler("project not found",404))
  }
  if(project.supervisor?._id.toString()!==teacherId.toString()){
    return next(new ErrorHandler("Not authorized to mark complete",403))
  }

  const updatedProject=await projectService.markComplete(projectId);

   await notificationService.notifyUser(
    project.student._id,
    `your project has been marked as completed by  your supervisor ${req.user.name}`,
    "general",
    "/student/status",
    "low",
  );
res.status(200).json({
  success:true,
  data:{
    project:updatedProject,

  },
  message:"Project mark as completed"
})
})

export const addFeedback = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const teacherId = req.user._id;
  const { message, title, type } = req.body;

  const project = await projectService.getProjectById(projectId);
 
  

  if (!project) {
    return next(new ErrorHandler("project not found", 404));
  }

  if (project.supervisor?._id.toString() !== teacherId.toString()) {
    return next(new ErrorHandler("Not authorized", 403));
  }

  if (!message || !title) {
    return next(new ErrorHandler("Feedback title and message is required", 400));
  }

  const { project: updatedProject, latestFeedback } =
    await projectService.addFeedback(projectId, teacherId, message, title, type);

  try {
    await notificationService.notifyUser(
      project.student,
      `new Feedback from your supervisor ${req.user.name}`,
      "feedback",
      "/student/feedback",
      type === "negative" ? "high" : "low"
    );
  } catch (err) {
    console.error(err);
  }

  res.status(200).json({
    success: true,
    message: "Feedback added successfully",
    data: {
      project: updatedProject,
      feedback: latestFeedback,
    },
  });
});

export const getFiles = asyncHandler(async (req, res, next) => {
  const teacherId = req.user._id;

  const projects =
    (await projectService.getProjectBySupervisor(teacherId)) || [];

  const allFiles = projects.flatMap((project) =>
    (project.files || []).map((file) => ({
      ...file.toObject(),
      projectId: project._id,
      projectTitle: project.title,
      studentName: project.student?.name || "-",
      studentEmail: project.student?.email || "-",
    }))
  );
  

  res.status(200).json({
    success: true,
    message: "file fetched successfully",
    data: {
      files: allFiles,
      
    },
  });
});


export const downloadFile = asyncHandler(async (req, res, next) => {
  const { projectId, fileId } = req.params;
  const supervisorId = req.user._id;

  const project = await projectService.getProjectById(projectId);
  if (!project) return next(new ErrorHandler("Project not found", 404));

  if (project.supervisor._id.toString()!==supervisorId.toString()) {
    return next(new ErrorHandler("Not authorized to download file", 403));
  }

  const file = project.files.id(fileId);
  if (!file) return next(new ErrorHandler("File not found", 400));

  return res.status(200).json({
    success: true,
    fileUrl: file.fileUrl,
    originalName: file.originalName,
  })

  // await fileServices.streamDownload(
  //   file.fileUrl,
  //   res,
  //   file.originalName
  // );
});

