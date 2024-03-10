import { Router } from "express";
import { check } from "express-validator";
import { checkAuth } from "../middlewares/authentiation.js";
import { createSubTask, deleteSubTask, updateSubTask,getSubTasks } from "../controller/subTask-controller.js";


export const subTaskRoute = Router();

subTaskRoute.use(checkAuth);

subTaskRoute.get("/",getSubTasks);

subTaskRoute.post(
  "/create",
  [
    check("taskId").trim().notEmpty().withMessage("please provide taskId")
  ],
  createSubTask
);


subTaskRoute.put('/update',
[
  check('status').isIn(['0', '1']).withMessage('Status must be either 0 or 1')  
],
updateSubTask
)

subTaskRoute.delete('/delete',
deleteSubTask
)

