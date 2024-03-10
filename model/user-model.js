import mongoose, { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    phoneNumber: { type: Number, required: true },
    priority: { type: Number, required: true },
  }
);

export const User = model('User',userSchema );
