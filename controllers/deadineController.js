
import {asyncHandler} from "../middlewares/asyncHandler.js"
import ErrorHandler from "../middlewares/error.js"
import { Deadline } from  "../Models/deadline.js"
import { Project } from "../Models/project.js"
import {getProjectById} from "../services/projectService.js"


export const createDeadline = asyncHandler(async (req, res,next) => {
const { id } = req.params;
  const { name,dueDate } = req.body;

  if(!name || !dueDate){
    throw new ErrorHandler(400,"Please provide all required fields");
  }
  const project=await getProjectById(id);
  if(!project){
    return next(new ErrorHandler("Project not found",404));
  }

  const deadlineData={
    name,
    dueDate:new Date(dueDate),
    project:project||null,
    createdBy:req.user._id
  }
  
  const deadline = await Deadline.create(deadlineData);

  await deadline.populate([{path:"createdBy",select:"name email"},{path:"project",select:"title student"}]);

  if(project){
    await Project.findByIdAndUpdate(project._id,
        {deadline:dueDate},
        {new:true,runValidators:true}
)
}

return res.status(201).json({
  success:true,
  data:{deadline},
    message:"Deadline created successfully"

})
}


);
