const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Tasks = require('./Tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'Anonymous'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Please provide a valid email id')
            }
        }
    },
    age: {
        type: Number,
        default: 18,
        validate(value) {
            if(value < 0) {
                throw new Error('Age cannot be negative')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the word password')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
      token: {
          type: String,
          required: true
      }  
    }]
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next){
    const user = this
    
    await Tasks.deleteMany({ owner: user._id })
    next()
})

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    user.save()
    return token
}

userSchema.statics.validateUserCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error ('Unable to login')
    }
    
    const isValid = await bcrypt.compare(password, user.password)
    if(!isValid) {
        throw new Error ('Unable to login')
    }

    return user
}

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

const User = mongoose.model('User', userSchema)

module.exports = User