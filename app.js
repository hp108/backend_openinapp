import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import { userRoute } from './routes/users-route.js';
import { taskRoute } from './routes/task-route.js';
import { subTaskRoute } from './routes/subtask-route.js';
import { startTwilioCronJobs } from './util/cron-jobs.js';


const app = express()

app.use(bodyParser.json())


app.use('/',userRoute)

app.use('/task',taskRoute)

app.use('/subtask',subTaskRoute)

// app.use('/task',taskRoute)

// app.use('/subtask',SubTaskRoute)

startTwilioCronJobs();


app.use((error,req,res,next)=>{
    if(res.headerSent)
    {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({'message': error.message || 'an error occured'})
})


mongoose.connect('mongodb+srv://hari:hari@cluster0.suaqdxj.mongodb.net/openinn?retryWrites=true&w=majority&appName=Cluster0').then(()=>{

app.listen(3000 || 4000,()=>{
    console.log('running in port number 3000')
});
}).catch((err)=>{
    console.log(err)
});

