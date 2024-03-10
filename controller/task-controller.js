import { SubTask } from "../model/sub-task-model.js";
import { Task } from "../model/task-model.js";
import { HttpError } from "../util/http-error.js";
import { validationResult } from "express-validator";


export const createTask = async (req, res, next) => {
    const { title, description, dueDate, status="TODO", priority=3, userId } = req.body;
    const { errors } = validationResult(req);
    if (errors.length !== 0) {
        return next(new HttpError(JSON.stringify(errors), 401));
    }
    let newDueDate;
    try{
        newDueDate=new Date(dueDate);

    }catch(err){
        console.log(err.message)
        return next(new HttpError("invalid date",403));
    }

    const user_id = userId;
    const task = new Task({ title, description, dueDate:newDueDate, status, priority, user_id });
    try {
        await task.save();
        res.json(task);
    } catch (err) {
        return next(new HttpError(err.message, 422));
    }
};

export const updateTask = async (req, res, next) => {
    const { dueDate, status } = req.body;
  
    if (status !== 'TODO' && status !== 'DONE') {
      return next(new HttpError('Invalid status. Status can be either "TODO" or "DONE".', 400));
    }
  
    if (isNaN(Date.parse(dueDate))) {
      return next(new HttpError('Invalid due_date. Please provide a valid date.', 400));
    }
  
    let task;
    try {
      task = await Task.findByIdAndUpdate(
        req.query.id,
        { dueDate: new Date(dueDate), status },
        { new: true }
      );
    } catch (err) {
      return next(new HttpError('Failed to update task. Please ensure the task exists.', 500));
    }
  
    if (!task) {
      return next(new HttpError('No task found with the provided id.', 404));
    }
    try {
      await SubTask.updateMany(
        { task_id: task._id },
        { status: status === 'DONE' ? 1 : 0 },
        { new: true }
      );
    } catch (err) {
      return next(new HttpError('Failed to update subtasks.', 500));
    }
  
    res.json(task);
};


export const deleteTask = async (req, res) => {
    const now = Date.now();
    try{
    await Task.findByIdAndUpdate(req.query.id, { deleted_at: now });
    await SubTask.updateMany({ taskId: req.params.id }, { deleted_at: now });
    }
    catch(err){
        return next(new HttpError("Failed to Delete Task",403))
    }
    res.json({ message: 'Task deleted' });
  };


  export const getTasks = async (req, res, next) => {
    const { priority, dueDate, page = 1, limit = 10 } = req.query;
    let uid;
    
    let filter = { user_id: req.body.userId};
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $gte: new Date(dueDate) };
    let tasks;
    try{
     tasks = await Task.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);
        if(tasks.length===0)
        {
            return next(new HttpError("No tasks found for the given user",403))
        }
    }
    catch(err)
    {
        return next(new HttpError("Unable to fetch details",403))
    }
    res.json(tasks);
}
