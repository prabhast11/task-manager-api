const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const { del } = require('express/lib/application')



const userSchema = new mongoose.Schema({
    name : { type : String,
            required : true,
             trim : true
            },
    
    email : { type : String,
                unique : true,
                trim : true,
                lowercase : true,
                required : true,
                validate(value) {
                    if(!validator.isEmail(value)) {
                        throw new Error('Email is invalid')
                    }
                }

    },
    age : {type : Number,
            default : 0,
            validate(value)  {
                if(value < 0){
                    throw new Error('Age must be a positive number')
                }
            }
            
    },

    password : { type : String,
                    required : true,
                    trim : true,
                    validate(value) {
                        if(value.includes("password")){
                            throw new Error('Try another password')
                        }

                        if(value.length <=6)
                        {
                            throw new Error('password must be atleast 7 bit long')
                        }
                    
                    }

    },

    tokens : [{
        tokens : {
            type : String,
            required : true
        }
    }],
        avatar : {
            type : Buffer
        }
},{
    timestamps : true
})

userSchema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'

})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens

    delete userObject.avatar
    return userObject

}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    console.log(process.env.JWT_SECRET)
    const tokens = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({tokens})
    await user.save()
    return tokens
}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user =await User.findOne({email : email})
    console.log(user)
    console.log(user.password)
    console.log(password)
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    // const isMatch1 = await bcrypt.compare(5,5)

    console.log(isMatch)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user

}


//Hash the plain text password before saving 
userSchema.pre('save',async function(next) {
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }

    next()

})

// Delete user tasks when user is removed

userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner : user._id })
    next()
}) 




const User = mongoose.model('User', userSchema)

module.exports = User