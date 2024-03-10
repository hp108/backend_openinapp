import cron from 'node-cron'
import { Task } from '../model/task-model.js';
import { User } from '../model/user-model.js';
import twilio from 'twilio';
const client = twilio("AC431348ae89ae76af6454fe6a9bdfd383","4368da5e0928b0baadea46fc09f6ea53");

const priorityJob = cron.schedule('* * * * *', async () => {
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

const callJob=cron.schedule('* * * * *', async () => {
    console.log('running')
    try{
  const tasks = await Task.find({ status: { $ne: 'DONE' }, deleted_at: null }).sort({ priority: 1 });
  for (let task of tasks) {
    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    if (currentDate > dueDate) {
      const user = await User.findById(task.user_id);
      if (user) {
        const call = await client.calls.create({
          url: 'https://handler.twilio.com/twiml/EHe6d0386b69daceca7c1bda47c7de8a76', // Replace with your TwiML URL
          to: user.phone_number,
          from: +16309483489
        });
        if (call.status !== 'failed') 
        {
            console.log('faileddd')
            break;
        }
      }
    }
  }
}
catch(err)
{
    console.log('error')
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