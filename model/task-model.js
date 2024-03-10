import mongoose,{Schema,model} from "mongoose";

const taskSchema = Schema({
    title: String,
    description: String,
    dueDate: Date,
    status: String,
    priority: Number,
    deleted_at:Date,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });

export const Task = model('Task',taskSchema );
