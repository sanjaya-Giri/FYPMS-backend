import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../Models/user.js";
import { Project } from "../Models/project.js";
import { SupervisorRequest } from "../Models/supervisorRequest.js";
import * as userServices from "../services/userServices.js";
import * as projectSerivces from "../services/projectService.js";
import * as notificationService from "../services/notificationServices.js";

export const createStudent = asyncHandler(async (req, res, next) => {
  const { name, email, password, department } = req.body;
  if (!name || !email || !password || !department) {
    return next(new ErrorHandler("Please provide all the fields", 400));
  }

  const user = await userServices.createUser({
    name,
    email,
    password,
    department,
    role: "Student",
  });

  res.status(200).json({
    success: true,

    message: "user createds successfully",
    data: { user },
  });
});

export const upadateStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.role;

  const user = await userServices.updateUser(id, updateData);
  if (!user) {
    return next(new ErrorHandler("Student not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "user updated successfully",
    data: { user },
  });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await userServices.getUserById(id);

  if (!user) {
    return next(new ErrorHandler("Student not found", 404));
  }

  if (user.role !== "Student") {
    return next(new ErrorHandler("User is not student", 400));
  }

  await userServices.deleteUser(id);

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
  });
});

export const createTeacher = asyncHandler(async (req, res, next) => {
  const { name, email, password, department, maxStudents, expertise } =
    req.body;
  if (
    !name ||
    !email ||
    !password ||
    !department ||
    !maxStudents ||
    !expertise
  ) {
    return next(new ErrorHandler("Please provide all the fields", 400));
  }

  const user = await userServices.createUser({
    name,
    email,
    password,
    department,
    maxStudents,
    expertise: Array.isArray(expertise)
      ? expertise
      : typeof expertise === "string" && expertise.trim() !== ""
        ? expertise.split(",").map((s) => s.trim())
        : [],
    role: "Teacher",
  });

  res.status(200).json({
    success: true,

    message: "Teacher created successfully",
    data: { user },
  });
});

export const upadateTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  delete updateData.role;

  const user = await userServices.updateUser(id, updateData);
  if (!user) {
    return next(new ErrorHandler("Student not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Teacher updated successfully",
    data: { user },
  });
});

export const deleteTeacher = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await userServices.getUserById(id);

  if (!user) {
    return next(new ErrorHandler("Teacher not found", 404));
  }

  if (user.role !== "Teacher") {
    return next(new ErrorHandler("User is not a Teacher ", 400));
  }

  await userServices.deleteUser(id);

  res.status(200).json({
    success: true,
    message: "Teacher deleted successfully",
  });
});

export const getAllUser = asyncHandler(async (req, res, next) => {
  const { users } = await userServices.getAllUser();

  res.status(200).json({
    success: true,
    message: "user fetched successfully",
    data: { users },
  });
});

export const getAllProject = asyncHandler(async (req, res, next) => {
  const projects = await projectSerivces.getAllProject();
  res.json({
    succcess: true,
    message: "Projects fetched successfully",
    data: { projects },
  });
});
export const getDashBoardStats = asyncHandler(async (req, res, next) => {
  const [
    totalStudents,
    totalTeachers,
    totalProjects,
    pendingRequests,
    completedProjects,
    pendingProjects,
  ] = await Promise.all([
    User.countDocuments({ role: "Student" }),
    User.countDocuments({ role: "Teacher" }),
    Project.countDocuments(),
    SupervisorRequest.countDocuments({ status: "pending" }),
    Project.countDocuments({ status: "completed" }),
    Project.countDocuments({ status: "pending" }),
  ]);

  res.status(200).json({
    success: true,
    message: "Dashboard stats fetched successfully",
    data: {
      totalStudents,
      totalTeachers,
      totalProjects,
      pendingRequests,
      completedProjects,
      pendingProjects,
    },
  });
});

export const assignSupervisor = asyncHandler(async (req, res, next) => {
    const {studentId, supervisorId } = req.body;

    if (!studentId || !supervisorId) {
        return next(new ErrorHandler("Student ID and Supervisor ID are required", 400));
    }
    const project=await Project.findOne({student:studentId});
    if(!project){
        return next(new ErrorHandler("Project not found for the student", 404));
    }
    if(project.supervisor!==null){
        return next(new ErrorHandler("Supervisor already assigned for this project", 400));
    }

    if(project.status!=="approved"){
        return next(new ErrorHandler("Project is not approved yet", 400));
    }else if(project.status==="pending"||project.status==="rejected"){
        return next(new ErrorHandler("Project is still pending or rejected", 400));
    }

    const{student,supervisor}=await userServices.assignSupervisorDirectly(studentId, supervisorId);

    project.supervisor=supervisor;
    await project.save();

    await notificationService.notifyUser(
        studentId,
        `You have been assigned a supervisor for your project. Supervisor Name: ${supervisor.name}, Email: ${supervisor.email}`,
        "approval",
        "/student/status",
        "low"
    );

    await notificationService.notifyUser(
        supervisorId,
        `The student ${student.name} has been assigned to you as a supervisor for their project. Student Email: ${student.email}`,
        "general",
        "/teacher/status",
        "low"
    );

    res.status(200).json({
        success: true,
        data: { student, supervisor },
        message: "Supervisor assigned successfully",
    });
})


export const getProject=asyncHandler(async(req,res,next)=>{
  const {id}=req.params;

  const project=await projectSerivces.getProjectById(id);

  if(!project){
    return next(new ErrorHandler("project not found",400))
  }

  const user=req.user;
  const userRole=(user.role||"").toLowerCase();
  const userId=user._id?.toString()||user.id;

  const hasAccess =
  userRole==="admin"||
    ( project.student._id.toString() === userId) ||
    (project.supervisor && project.supervisor._id.toString() === userId) ||
    (userRole === "admin");

    if (!hasAccess) {
      return next(new ErrorHandler("Not authorized to fetch project", 403));
    }
    return res.status(200).json({
      succcess:true,
      data:{project}
    })

})

export const updateProjectStatus=asyncHandler(async(req,res,next)=>{
const {id}=req.params;
const updateData=req.body;
const user=req.user;

const project=await projectSerivces.getProjectById(id);

  if(!project){
    return next(new ErrorHandler("project not found",400))
  }

  const userRole=(user.role||"").toLowerCase();
  const userId=user._id?.toString()||user.id;

  const hasAccess =
  userRole==="admin"||
    ( project.student._id.toString() === userId) ||
    (project.supervisor && project.supervisor._id.toString() === userId) ||
    (userRole === "admin");

    if (!hasAccess) {
      return next(new ErrorHandler("Not authorized to update project status", 403));
    }

    const updatedProject=await projectSerivces.updateProject(id,updateData);

    return res.status(200).json({
      success:true,
      message:"Project status updatedd successfully",
      data:{project:updatedProject}
    })
})