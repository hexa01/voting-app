const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    mobile:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    citizenshipNumber:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    role: {
        type: String,
        enum: ['voter','admin'],
        default: 'voter'
    },
    hasVoted: {
        type:Boolean,
        default: false
    }
});

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        if (candidatePassword === this.password){
            return true;
        }
        return false;

    }catch(err){
        throw err;
    }
}


const User = mongoose.model('User',userSchema);
module.exports = User;
