import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import { userRoute } from './routes/users-route.js';
import { taskRoute } from './routes/task-route.js';
import { subTaskRoute } from './routes/subtask-route.js';
import { startTwilioCronJobs } from './util/cron-jobs.js';
import 'dotenv/config'


const app = express()

app.use(bodyParser.json())


app.use('/',userRoute)

app.use('/task',taskRoute)

app.use('/subtask',subTaskRoute)

startTwilioCronJobs();


app.use((error,req,res,next)=>{
    if(res.headerSent)
    {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({'message': error.message || 'an error occured'})
})


mongoose.connect(process.env.DB_URL).then(()=>{

app.listen(3000,()=>{
    console.log('running in port number 3000')
});
}).catch((err)=>{
    console.log(err)
});

