const express = require('express');
const Employee = require('./models/employees.model.js');
const Attandence = require('./models/attandence.model.js');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello vc...from server");
});

app.get('/employees',async(req,res)=>{
    try {
        const employee = await Employee.find({});
        res.status(200).json(employee);

    } catch (error) {
        res.status(500).json({massage:error.massage});
    }
});
app.post('/employees',async(req,res)=>{
    try{
        const employee = await Employee.create(req.body);
        res.status(200).json(employee);
        employee.save();
        console.log("data inserted")
    }
    catch(error){
        res.status(500).json({massage:error.massage});
    }
});

app.get("/employees/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findById(id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({massage:error.massage});
    }
});

app.put("/employees/:id", async (req,res) => {
    try {
        const {id} = req.params;
        const employee = await Employee.findByIdAndUpdate(id,req.body);

        if(!employee) {
        return res.status(404).json({massage:"employee not found"});
        }

        const updated = await Employee.findById(id);
        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({massage:error.massage});
    }
});

app.delete('employees/:id',async (req,res)=>{
    try {
        const {id} = req.params;
        const employee = await Employee.findByIdAndDelete(id);
        if(!employee) {
            return res.status(404).json({massage:"employee not found"});
        }

        res.status(200).json({massage:"deleted successfully"});
        
    } catch (error) {
        res.status(500).json({massage:error.massage});
    }
});
async function recordAttendance(employeeId, status, hoursWorked) {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        throw new Error('Employee not found');
      }
  
      const today = new Date();
      const existingAttendance = employee.attendance.find(entry =>
        entry.date.toDateString() === today.toDateString()
      );
  
      if (existingAttendance) {
        existingAttendance.status = status;
        existingAttendance.overtime = Math.max(hoursWorked - employee.regularHours, 0);
      } else {
        const overtime = Math.max(hoursWorked - employee.regularHours, 0);
        employee.attendance.push({ date: today, status: status, overtime: overtime });
      }
  
      await employee.save();
      console.log("Attendance recorded for ${employee.name}: ${status}");
    } catch (error) {
      console.error('Error recording attendance:', error.message);
    }
  }
  
  // Example usage:
  recordAttendance('employeeId', 'present', 9);
// app.get('/attandence',async(req,res)=>{
//     try {
//         const attandence = await Attandence.find({});
//         res.status(200).json(attandence);

//     } catch (error) {
//         res.status(500).json({massage:error.massage});
//     }
// });
// app.post('/attandence',async(req,res)=>{
//     try{
//         const attandence = await Attandence.create(req.body);
//         res.status(200).json(employee);
//         attandence.save();
//         console.log("data inserted")
//     }
//     catch(error){
//         res.status(500).json({massage:error.massage});
//     }
// });



mongoose.connect("mongodb://127.0.0.1:27017/web-assignment")
.then(()=>{

    console.log("Connected to database");
    app.listen(3000,()=>{
        console.log("Server is started at @3000");
    });

})
.catch(()=>{
    console.log("Connection fail");
});