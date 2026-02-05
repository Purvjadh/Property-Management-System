import mongoose,{Schema} from 'mongoose'

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    fullName:{
        type:String,
        required:true,

    }
},{timestamps:true})

export const User = mongoose.model("User",userSchema)