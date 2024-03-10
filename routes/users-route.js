import { Router } from "express";
import { check } from "express-validator";
import { getUsers,signup,login } from "../controller/user-controller.js";

export const userRoute = Router();

userRoute.get("/", getUsers);

userRoute.post(
  "/signup",
  [
    check("phoneNumber").trim().notEmpty().withMessage("please provide phoneNumber of the user"),
    check("priority").trim().notEmpty().withMessage("please provide priority of the user"),
  ],
  signup
);

userRoute.post("/login",[
    check("phoneNumber").trim().notEmpty().withMessage("please provide phoneNumber of the user"),
  ], login);
