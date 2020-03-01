const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth')

//CREATE task
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        const result = await task.save();
        res.send(result);
    } catch (e) {
        res.status(400).send(e);
    }

    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
});

//READ single task
router.get('/tasks/:tskId', auth, async (req, res) => {
    const _id = req.params.tskId;
    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }

    // const id = req.params.tskId;
    // Task.findById(id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // });
});

//READ all tasks
// GET /tasks?completed=true&limit-2&skip=2&sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed.toLowerCase() === 'true';  // output from === comparison sets completed value
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_');
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
    }
    try {
        // const tasks = await Task.find({ owner: req.user._id });
        // Alternate method >
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.send(req.user.tasks);
    } catch (e) {
        res.status(404).send(e);
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // })
});

//UPDATE single task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate)
        return res.status(400).send('Invalid update...');
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        // const task = await Task.findById(req.params.id);
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task)
            return res.status(404).send('Task not found...');
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

//DELETE single task
router.delete('/tasks/:id', auth, (req, res) => {
    Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id }).then((task) => {
        if (!task)
            return res.status(404).send('Task not found...');
        res.send(task);
    }).catch((e) => res.status(400).send(e));
});

module.exports = router;