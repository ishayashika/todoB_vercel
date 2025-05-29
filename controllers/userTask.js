import Task from "../models/task.js";
import createError from "../utils/createError.js";

export const createTask = async(req,res,next)=>{
console.log("Creating task with title:", req.body.title);
console.log("User ID from token:", req.user.id);

const newTask = new Task({
title: req.body.title,
user: req.user.id,
completed: req.body.completed || false,
status: req.body.status || 'pending',
isDeleted: false
});
try {
console.log("Saving task to database");
const newUserTask = await newTask.save();// Save task to MongoDB
console.log("Task saved with ID:", newUserTask._id);
return res.status(201).json(newUserTask);    // Return saved task
} catch (error) {
  console.error("Error creating task:", error);
  return next(error)  // Forward error to error handler
}
}

/* -------------------------- GET ALL TASKS --------------------------- */
// Admin-level: Gets all tasks regardless of user
export const getAllTaskUCreated = async (req, res, next) => {
  try {
    const allTask = await Task.find({}); // Fetch all tasks
    return res.status(200).json(allTask); // Return all tasks
  } catch (error) {
    return next(error); // Error handling
  }
};



/* --------------- GET TASKS OF CURRENT LOGGED-IN USER ---------------- */
// Only returns tasks created by the logged-in user
export const getCurrentUserTask = async (req, res, next) => {
  try {
    console.log("Getting tasks for user ID:", req.user.id);
    const currentTask = await Task.find({
      user: req.user.id,     // Only fetch tasks created by this user
      isDeleted: false       // Exclude soft-deleted tasks
    });
    console.log("Found tasks:", currentTask.length);
    return res.status(201).json(currentTask); // Return user tasks
  } catch (error) {
    console.error("Error in getCurrentUserTask:", error);
    return next(error); // Forward error
  }
};

/* ----------------------------- UPDATE TASK --------------------------- */
export const upadateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).exec(); // Get task by ID
    console.log("Updating task:", task);

    // If task not found
    if (!task)
      return next(createError({ status: 404, message: "Task not found" }));

    // Check if the task belongs to the logged-in user
    if (task.user.toString() !== req.user.id)
      return next(createError({ status: 401, message: "It's not your task" }));

    // Determine new values or keep old ones if not updated
    const updateData = {
      title: req.body.title !== undefined ? req.body.title : task.title,
      completed:
        req.body.completed !== undefined ? req.body.completed : task.completed,
      status:
        req.body.status ||
        (req.body.completed
          ? 'completed'
          : task.status !== 'completed'
          ? task.status
          : 'pending')
    };

    console.log("Update data:", updateData);

    // Update and return the new task
    const upadateIt = await Task.findByIdAndUpdate(
      req.params.taskId,
      updateData,
      { new: true }
    );
    return res.status(200).json(upadateIt);
  } catch (error) {
    return next(error); // Handle error
  }
};

export const deleteTask = async(req,res,next)=>{
  try {
    const task = await Task.findById(req.params.taskId).exec();
    if(!task) return next(createError({status:404, message:"Task not found"}));
    if(task.user.toString() !== req.user.id) return next(createError({
      status:401, message: "It's not your task"
    }));
    
    // Instead of deleting, update isDeleted to true
    await Task.findByIdAndUpdate(req.params.taskId, { isDeleted: true });
    
    return res.status(200).json("Task marked as deleted successfully") 
  }catch (error) {
   return  next(error)
  }
}

export const deleteAll = async(req,res,next)=>{
  try {
    // Update all user's tasks to isDeleted: true instead of deleting them
    await Task.updateMany(
      { user: req.user.id },
      { isDeleted: true }
    );
    return res.json('All Tasks Marked as Deleted Successfully');
  } catch (err) {
    return next(err);
  }
}

export const getDeletedTasks = async(req,res,next)=>{
  try {
    console.log("Getting deleted tasks for user ID:", req.user.id);
    const deletedTasks = await Task.find({
      user: req.user.id,
      isDeleted: true
    });
    console.log("Found deleted tasks:", deletedTasks.length);
    return res.status(200).json(deletedTasks)  
  } catch (error) {
    console.error("Error getting deleted tasks:", error);
    return next(error)
  }
}