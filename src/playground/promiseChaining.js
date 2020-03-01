require('../db/mongoose');
const Task = require('../models/task');

// Task.findByIdAndDelete('5e560b439c67a4458cae593c').then((task)=>{
//     console.log(task);
//     return Task.countDocuments({completed:true});
// }).then((count)=>{
//     console.log(count)
// }).catch((e)=>{
//     console.log(e);
// });

const findDeleteCount = async (id,completed) => {
    const task = await Task.findByIdAndDelete(id);
    const count =await Task.countDocuments({completed});    //Task.countDocuments({completed:completed}) short form!
    return {task,count};
}
findDeleteCount('5e56436252bbf04a5c534ea2',true).then((result)=>{
    console.log(result.task,result.count);
}).catch((e)=>{
    console.log(e);
});