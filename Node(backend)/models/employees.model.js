const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required: true
        },
        mobileNum:{
            type:Number,
            required: [true,"please enter your number"]
        },
        gender:{
            type:String,
            required: [true,"please enter your gender"]
        },
        email:{
            type:String,
            required: [true,"please enter your email"]
        },
        dateOfjoining:{
            type:Date,
            required: false
        }
        // Image:{
        //     type:Image,
        //     required:false
        // },
        // salary:{
            
        // }

    }
);
const Employee = mongoose.model("Employee",EmployeeSchema);

module.exports = Employee;

