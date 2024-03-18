fetch('http://127.0.0.1:3000/recordAttendence',{
    method: "POST",
    body: JSON.stringify({
        employeeId: '65f516ccfa112a8c5f069701b',
        status:"present" ,
        hoursWorked:10,
    }),

    headers: {
        "content-type": "application/json"
    }
}).then(res=>res.json())
.then(res=>{console.log(res)})

//-------------------------------------------------------update attendence test

// fetch('http://127.0.0.1:3000/updateAttendence',{
//     method: "POST",
//     body: JSON.stringify({
//         employeeId: '65f507b9e6da40912aeb67c0',
//         status:"present" ,
//         date: new Date(),
//         hoursWorked:8,
//     }),
//     headers: {
//         "content-type": "application/json"
//     }
// }).then(res=>res.json())
// .then(res=>{console.log(res)})


//-----------------------------------------------salary calcuation


// fetch('http://127.0.0.1:3000/calculateSalary',{
//     method: "POST",
//     body: JSON.stringify({
//         employeeId: '65f516ccfa112a8c5f06971b',
//         month: 2,
//         year: 2024
//     }),
//     headers: {
//         "content-type": "application/json"
//     }
// }).then(res=>res.json())
// .then(res=>{console.log(res)})

// ---------------------------------------------delete employee

// fetch('http://127.0.0.1:3000/employees/65f13b0a044d3ab33f2c82b5',{
//     method: "DELETE"
// }).then(res=>res.json())
// .then(res=>{console.log(res)})

//----------------------------------------------getById-------------------

// fetch('http://127.0.0.1:3000/employees/65f3235b84081cbd7a948603',{
//     method: "GET"
// }).then(res=>res.json())
// .then(res=>{console.log(res)})

// console.log(new Date())