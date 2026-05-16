import { User } from "../Models/user.js";

export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

export const updateUser = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}; // ← This closing brace was missing

export const getUserById = async (id) => {
  try {
    return await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpire",
    );
  } catch (error) {
    throw new Error(`Error getting user: ${error.message}`);
  }
};

export const deleteUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await user.deleteOne();
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

export const getAllUser = async () => {
  const query = { role: { $ne: "Admin" } };

  const users = await User.find(query)
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .sort({ createdAt: -1 });
   
    

    return {users};

};


export const assignSupervisorDirectly = async (studentId, supervisorId) => {
  const student = await User.findOne({_id:studentId,role:"Student"});
  const supervisor = await User.findOne({_id:supervisorId,role:"Teacher"});

  if(!student||!supervisor){
    throw new Error(" student or supervisor not found");
  }
  if(!supervisor.hasCapacity()){
    throw new Error("Selected supervisor has reached maximum student capacity");
  }
student.supervisor=supervisor._id;
supervisor.assignedStudents.push(studentId);
await Promise.all([student.save(),supervisor.save()]);
  return { student, supervisor };
}