import {SubTask} from '../model/sub-task-model.js'
import { Task } from '../model/task-model.js';
import { HttpError } from '../util/http-error.js';
import { validationResult } from 'express-validator';


export const createSubTask = async (req, res,next) => {
  const { taskId } = req.body;
  let subTask;
  try{
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new HttpError("Task not found", 404));
  }
  subTask = new SubTask({ task_id:taskId, status: 0 });
  await subTask.save();

  await Task.findById(taskId);
  if (task.status === 'DONE') {
    task.status = 'IN_PROGRESS';
    await task.save();
  }
}
  catch(err)
  {
      return next(new HttpError(err.message,422));
  }
  res.json(subTask);
};

export const updateSubTask = async (req, res,next) => {

    const {errors} = validationResult(req)
    if(errors.length != 0)
    {
      console.log(errors)
        return next(new HttpError(errors[0].msg,401))
    }
    const { status } = req.body;
    let subTask;
    try{
     subTask = await SubTask.findOne({ _id: req.query.id, deleted_at: null });

      if (!subTask) {
        return next(new HttpError("Subtask not found or has been deleted", 404));
      }
      
      subTask.status = status;
      await subTask.save();
      
      const task = await Task.findById(subTask.task_id);
    let subTasks = await SubTask.find({ task_id: task.id, deleted_at: null });
    
    if (subTasks.some(subTask => subTask.status === 1)) {
      task.status = 'IN_PROGRESS';
    }
    if (subTasks.every(subTask => subTask.status === 1)) {
      task.status = 'DONE';
    }
    if(subTasks.every(subTask=> subTask.status === 0 ))
    {
        task.status='TODO';
    }
    
    await task.save();
    }
    catch(err){
        return next(new HttpError("please provide valid subtask",422))
    }
    res.json(subTask);
};


export const deleteSubTask= async (req, res,next) => {

  try{
  const subTask = await SubTask.findByIdAndUpdate(req.query.id, { deleted_at: Date.now() });
  const task = await Task.findById(subTask.task_id);
  const subTasks = await SubTask.find({ task_id: task.id, deleted_at: null });
  if (subTasks.every(subTask => subTask.status === 1)) {
    task.status = 'DONE';
  }
  if(subTasks.every(subTask => subTask.status === 0)){
    task.status = 'TODO'
  }
  await task.save();
  }
  catch(err){
    return next(new HttpError(err.message,422))
  }
  res.json({ message: 'Subtask deleted' });
};
  

export const getSubTasks= async(req,res,next)=>{

  const userId = req.body.userId;
  const taskId= req.query.taskId;
  try{
  const tasks = await Task.find({ user_id: userId });
  const taskIds = tasks.map(task => task._id);
  let filter={ task_id: { $in: taskIds } }
  filter.deleted_at=null;
  if(taskId){
    filter.task_id=taskId;
  }
  const subTasks = await SubTask.find(filter);
  if(subTasks.length===0)
  {
    return next(new HttpError("no subTasks found",403));
  }

  res.json(subTasks);
  }
  catch(err)
  {
    return next(new HttpError("Unable to get tasks of the user",403))
  }

}