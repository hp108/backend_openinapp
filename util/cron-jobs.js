import cron from 'node-cron'
import { Task } from '../model/task-model.js';
import { User } from '../model/user-model.js';
import twilio from 'twilio';
import 'dotenv/config'


const TWILIO_ACCOUNT_SID = process.env.TWILIO_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_TOKEN;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const priorityJob = cron.schedule('* */6 * * *', async () => {
  const tasks = await Task.find({ status: { $ne: 'DONE' }, deleted_at: null });
  const currentDate = new Date();
  tasks.forEach(async (task) => {
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));
    let priority;
    if (diffDays <= 0) priority = 0;
    else if (diffDays <= 2) priority = 1;
    else if (diffDays <= 4) priority = 2;
    else priority = 3;
    await Task.updateOne({ _id: task._id }, { priority });
  });
});

const callJob=cron.schedule('*/5 * * * *', async () => {
    try{
  const tasks = await Task.find({ status: { $ne: 'DONE' }, deleted_at: null }).sort({ priority: 1 });
  for (let task of tasks) {
    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    if (currentDate > dueDate) {
      const user = await User.findById(task.user_id);
      let call;
      if (user) {
         call = await client.calls.create({
          url: 'http://demo.twilio.com/docs/voice.xml',
          to: "+919550336871",
          from: '+16309483489'
        }).then((call)=>{
          return call
      });
      }
    }
  }
}
catch(err)
{
    console.log('error',err)
    return new Error("Something wenr wrong with twilio")
}
});


const startTwilioCronJobs = () => {
    priorityJob.start();
    callJob.start();
  };
  
  const stopTwilioCronJobs = () => {
    priorityJob.stop();
    callJob.stop();
  };
  
  export { startTwilioCronJobs, stopTwilioCronJobs };