const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})








// const me = new User({
//     name: 'Anuj',
//     email:'anuj@gmail.com',
//     password:'paSSw1ord123',
//     age: 29
// })

// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })

// const task = new Task({
//     description: 'Get up in the morning',
//     completed: true
// });

// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log('Error!!! ', error);
// });
