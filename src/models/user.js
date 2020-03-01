const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        },
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain "password"!');
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number!')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }
    ]
},{
    timestamps:true
});

//Add task relationship to every user owner
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//remove password and tokens from user while stringifying output in res.send()
userSchema.methods.toJSON = function () {
    const user = this;
    //get RAW Object from mongoose user object
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

//Create custome function on userSchema instance (user) <<< INSTANCE METHODS >>>
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismysecrettokenkey');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}


//Create custom function on userSchema model  <<<< MODEL METHODS >>>
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user)
        throw new Error('Email not found');
    const isValidUser = await bcrypt.compare(password, user.password);
    if (!isValidUser)
        throw new Error('Invalid password entered');
    return user;
}

//  <<< MIDDLEWARE >>> !!!
//Hash passwords before saving!
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();  //Signifies end of all pre-async functions
});

userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;