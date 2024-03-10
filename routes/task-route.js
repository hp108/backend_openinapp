import { Router } from "express";
import { check } from "express-validator";
import {createTask,deleteTask,getTasks,updateTask} from '../controller/task-controller.js'
import { checkAuth } from "../middlewares/authentiation.js";

export const taskRoute = Router();


taskRoute.use(checkAuth);

taskRoute.get('/',getTasks);

taskRoute.post(
  "/create",
  [
    check("title").trim().notEmpty().withMessage("please provide title"),
    check("description").trim().notEmpty().withMessage("please provide description"),
    check('duedate')
  ],
  createTask
);

taskRoute.put('/update',
  [
    check("dueDate"),
    check("status").isIn(['TODO','DONE']).withMessage("only TODO and DONE status can be changed")
  ],
  updateTask
)

taskRoute.delete('/delete',deleteTask);
