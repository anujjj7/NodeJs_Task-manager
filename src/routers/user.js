const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

//CREATE user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
    // using PROMISE syntax!!!!!!!!!!!!!!!!!!!!!!
    // const user = new User(req.body);
    // user.save().then(() => {
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
})

//LOGIN user
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(404).send(e);
    }
});

//LOGOUT single user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send('User logged out successfully...');
    } catch (e) {
        res.status(500).send('Error while logging out user...');
    }
});

//LOGOUT ALL users
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('All users logged out...');
    } catch (e) {
        res.status(500).send(e);

    }
});

//Read Profile
router.get('/users/me', auth, async (req, res) => {
    try {
        const user = req.user;
        res.status(201).send(user);
    } catch (e) {
        res.status(401).send(e);
    }
});

// //READ all users
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         res.status(400).send(e);
//     }

//     // User.find({}).then((users) => {
//     //     res.send(users);
//     // }).catch((e) => {
//     //     res.status(500).send(e);
//     // })
// });

//READ single user
router.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found :/');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }

    // const _id = req.params.id;
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send();
    //     }
    //     res.status(200).send(user);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // });
});

//UPDATE single user
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid update!' });
    }
    try {
        //Below does not work with mongoose MIDDLEWARE functions! (pre - 'save')
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        //Old code for /users/:id path
        // const user = await User.findById(req.params.id);
        // if (!user) {
        //     return res.status(404).send('User not found');
        // }

        updates.forEach((update) => req.user[update] = req.body[update]); //Object property BRACKET NOTATION
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

//DELETE single user
router.delete('/users/me', auth, async (req, res) => {

    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }

    //Old code for /users/:id path and Promises then-catch syntax
    // User.findByIdAndDelete(req.params.id).then((user) => {
    //     if (!user)
    //         return res.status(404).send('User not found...');
    //     res.send(user);
    // }).catch((e) => res.status(400).send(e));
});

module.exports = router;