import mongoose, { Schema, model } from "mongoose";

const subTaskSchema = new Schema({
    task_id: { type: Schema.Types.ObjectId, ref: 'Task' },
    status: { type: Number, enum: [0, 1] },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date }
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  });

export const SubTask = model('SubTask',subTaskSchema);



