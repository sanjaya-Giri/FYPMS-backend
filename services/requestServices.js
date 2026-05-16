import ErrorHandler from "../middlewares/error.js";
import { SupervisorRequest } from "../Models/supervisorRequest.js";
import { User } from "../Models/user.js";
import { Project } from "../Models/project.js";
export const createRequest = async (requestData) => {
  const existingRequest = await SupervisorRequest.findOne({
    student: requestData.student,
    supervisor: requestData.supervisor,
    status: "pending",
  });
  if (existingRequest) {
    return next(
      new ErrorHandler(
        "You have alreay  sent a request to this supervisor",
        400,
      ),
    );
  }
  const request = await SupervisorRequest.create(requestData);
  return await request.save();
};

export const getAllRequests = async (filters) => {
  const requests = await SupervisorRequest.find(filters)
    .populate("student", "name email")
    .populate("supervisor", "name email")
    .sort({ createdAt: -1 });

  const total = await SupervisorRequest.countDocuments(filters);

  return { requests, total };
};

export const acceptRequest = async (requestId, teacherId) => {
  const request = await SupervisorRequest.findById(requestId)
    .populate("student", "name email supervisor")
    .populate("supervisor", "name email assignedStudents maxStudents");

  if (!request) {
    throw new ErrorHandler("Request not found", 404);
  }

  // Authorization check
  if (request.supervisor._id.toString() !== teacherId.toString()) {
    throw new ErrorHandler(
      "You are not authorized to accept this request",
      403,
    );
  }

  // Already processed check
  if (request.status !== "pending") {
    throw new ErrorHandler("Request is already processed", 400);
  }

  // Fetch actual documents (IMPORTANT)
  const student = await User.findById(request.student._id);
  const supervisor = await User.findById(teacherId);

  if (!student || !supervisor) {
    throw new ErrorHandler("Student or supervisor not found", 404);
  }

  // Prevent duplicate assignment
  if (student.supervisor) {
    throw new ErrorHandler("Student already has a supervisor", 400);
  }

  // Optional: capacity check
  if (supervisor.hasCapacity && !supervisor.hasCapacity()) {
    throw new ErrorHandler("Supervisor has reached max capacity", 400);
  }

  // ✅ Assign supervisor (same as admin logic)
  student.supervisor = teacherId;

  // Prevent duplicate push
  if (!supervisor.assignedStudents.includes(student._id)) {
    supervisor.assignedStudents.push(student._id);
  }

  // Save both documents
  await Promise.all([student.save(), supervisor.save()]);

  const project = await Project.findOne({ student: student._id });

  if (project) {
    project.supervisor = teacherId;
    await project.save();
  }

  // Update request status AFTER successful assignment
  request.status = "accepted";
  await request.save();

  return request;
};

export const rejectRequest = async (requestId, teacherId) => {
  const request = await SupervisorRequest.findById(requestId)
    .populate("student", "name email ")
    .populate("supervisor", "name email ");

  if (!request) {
    throw new ErrorHandler("Request not found");
  }
  if (request.supervisor._id.toString() !== teacherId.toString()) {
    throw new ErrorHandler("You are not authorized to reject this request");
  }
  if (request.status !== "pending") {
    throw new ErrorHandler("Request is already processed");
  }
  request.status = "rejected";
  await request.save();
  return request;
};
