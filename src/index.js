require('./db/mongoose');
const express = require('express');
const userRouter=require('./routers/user');
const taskRouter=require('./routers/task');

const app = express();

// without Express middleware:  new request -> run route handlers
// with Express middleware:     new request -> do something -> run route handlers

// app.use((req,res,next)=>{
//     res.status(503).send('Site is under maintenance... '+req.method+req.path);
//     next();
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})

const Task =require ('./models/task');
const User=require('./models/user')
const myFunction=async ()=>{
    //Get user owner for each task
    // const task=await Task.findById('5e59fc7b173b1a4bb46da0e5');
    // await task.populate('owner').execPopulate();
    // console.log(task.owner);

    //Get all tasks for an owner
    // const user= await User.findById('5e59f9158a075b3090f5785d');
    // await user.populate('tasks').execPopulate();
    // console.log(user.tasks);

}
myFunction();
