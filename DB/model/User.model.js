import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({
    firstName:String,
    lastName:String,
    wishList:{type:[{type:mongoose.Types.ObjectId,ref:"Product"}]},
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
        lowercase:true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    active: {
        type: String,
        default: 'offline',
        enum:["offline","online","blocked"]
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    image: String,
    DOB: String,
    gender:{type:String,default:'male',enum:['male','female']},
    address:String,
    forgetCode:{type:String,default :null},
    changePasswordTime:Date
}, {
    timestamps: true
})


const User = model('User', userSchema)
export default User