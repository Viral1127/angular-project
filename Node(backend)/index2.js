const Employee = require('./models/employee.model');
const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')


// Function to record attendance and calculate overtime for an employee
async function recordAttendance(employeeId, status, hoursWorked) {
  try {
    // console.log(employeeId)
    const employee = await Employee.findOne({_id : employeeId});
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
      console.log("hoversword", hoursWorked)
      console.log("employee.regularHours", employee.regularHours);
      const overtime = Math.max(hoursWorked - employee.regularHours, 0);
      console.log("overtime",overtime)
      employee.attendance.push({ date: today, status: status, overtime: Number(overtime) });
    }

    await employee.save();
    console.log("Attendance recorded for ${employee.name}: ${status}");
    return employee
  } catch (error) {
    console.error('Error recording attendance:', error.message);
  }
}

// Function to update attendance and overtime for an employee
async function updateAttendance(employeeId, date, status, hoursWorked) {
  try {
    const employee = await Employee.findOne({_id : employeeId});
    if (!employee) {
      throw new Error('Employee not found');
    }
    date = new Date(date)
    const existingAttendance = employee.attendance.find(entry =>
      entry.date.toDateString() === date.toDateString()
    );

    if (!existingAttendance) {
      throw new Error('Attendance entry not found for the specified date');
    }

    existingAttendance.status = status;
    existingAttendance.overtime =  (status === "absent") ? 0 : Math.max(hoursWorked - employee.regularHours, 0);
    console.log(hoursWorked);
    console.log(employee.regularHours);

    await employee.save();
    console.log('Attendance updated for ${employee.name} on ${date}: ${status}');
  } catch (error) {
    console.error('Error updating attendance:', error.message);
  }
}


// Function to calculate employee salary for a given month
async function calculateMonthlySalary(employeeId, month, year) {
  try {
    console.log("month body", month)
    console.log('year body', year);
    const employee = await Employee.findOne({_id : employeeId});
    if (!employee) {
      throw new Error('Employee not found');
    }
    const regularHourlyRate = employee.salary/employee.regularHours
    // Initialize variables for total hours worked and overtime hours
    let totalHoursWorked = 0;
    let totalOvertimeHours = 0;

    // Filter attendance records for the specified month and year
    const filteredAttendance = employee.attendance.filter(entry =>{
      console.log('month',entry.date.getMonth())
      console.log('year',entry.date.getFullYear() )
      return entry.date.getMonth() === month && entry.date.getFullYear() === year}
    );
      console.log('attendence array', filteredAttendance)
    // Calculate total hours worked and overtime hours for the filtered attendance
    filteredAttendance.forEach(entry => {
      totalHoursWorked += entry.status === 'present' ? employee.regularHours : 0;
      totalOvertimeHours += entry.status === 'present' ? Math.max(entry.overtime, 0) : 0;
    });
    console.log("-----------------",totalHoursWorked)


    // Calculate salary including overtime pay
    const regularSalary = totalHoursWorked * regularHourlyRate;
    const overtimePay = totalOvertimeHours * (regularHourlyRate * 0.05); // 5% of regular hourly rate per overtime hour
    const totalSalary = (regularSalary + overtimePay)
    console.log("total salary = ",regularSalary);

    return totalSalary;
  } catch (error) {
    console.error('Error calculating monthly salary:', error.message);
    return 0; // Return 0 if an error occurs
  }
}

// Example usage:
// const employeeId = 'employeeId';
// const regularHourlyRate = 10; // Regular hourly rate for the employee
// const month = 2; // February
// const year = 2024;
// const monthlySalary = await calculateMonthlySalary(employeeId, regularHourlyRate, month, year);
// console.log('Monthly salary for employee for ${month}/${year}: $${monthlySalary.toFixed(2)}');



mongoose.connect('mongodb://127.0.0.1:27017/Employee')
.then(()=>{
    const app = express();
    app.use(cors());
    app.use(bodyParser({extended:true}))
    app.post('/recordAttendence', async (req,res)=>{
        console.log(req.body)
        const emp = await recordAttendance(req.body.employeeId,req.body.status,req.body.hoursWorked)
        res.send({msg : "done", emp : emp})
    })

    app.post('/updateAttendence', async (req,res)=>{
      console.log(req.body)
      const emp = await updateAttendance(req.body.employeeId,req.body.date,req.body.status,req.body.hoursWorked)
      res.send({msg : "Updated Succesfully", emp : emp})
  })

  app.post('/calculateSalary', async (req,res)=>{
    console.log(req.body)
    const emp = await calculateMonthlySalary(req.body.employeeId,  req.body.month, req.body.year)
    res.send({msg : "calculated salary", emp : emp})
})

    app.get('/employees',async (req,res)=>{
        try {
            const employee = await Employee.find();
            res.status(200).json(employee);
    
        } catch (error) {
            res.status(500).json({massage:error.massage});
        }
    });

    app.get('/employees/:id',async (req,res)=>{
      try {
          const {id} = req.params;
          const employee = await Employee.findById(id);
          if(!employee) {
              return res.status(404).send({massage:"employee not found"});
          }
          res.status(200).send(employee);
          
      } catch (error) {
          console.log(error)
          res.status(500).send({massage:error.massage});
      }
  });

    app.post('/employees',async (req,res)=>{
        try{
            console.log(req.body)
            const employee = new Employee(req.body);
            await employee.save();
            res.status(200).send(employee);
        }
        catch(error){
            res.status(500).send({massage:error.massage});
        }
    });

    app.delete('/employees/:id',async (req,res)=>{
      try {
          const {id} = req.params;
          const employee = await Employee.findByIdAndDelete(id);
          if(!employee) {
              return res.status(404).send({massage:"employee not found"});
          }
          res.status(200).send({massage:"deleted successfully"});
          
      } catch (error) {
          console.log(error)
          res.status(500).send({massage:error.massage});
      }
  });

    console.log("Connected to database");
    app.listen(3000,()=>{
        console.log("Server is started at @3000");
    });

})
.catch(()=>{
    console.log("Connection fail");
});