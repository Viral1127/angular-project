const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  salary: Number, 
  mobileNum:Number,
  email:String,
  dateOfjoining:Date,
  regularHours: Number, 
  attendance: [{type : {
        date: Date,
        status: {
          type: String,
          enum: ['present', 'absent']
        },
        overtime: Number
      
  }, default: []}]
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;