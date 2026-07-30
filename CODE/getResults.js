let fs = require("fs");
let path = require("path");
const { dirname } = require("path");
let sessionID = "D9CF1614291E4645F70301A7941D8B4D.jvm2";
let qualificationId = "575";
let syllbusId = "386";
let semesterId = ["1","2","3"];   // dynamic no need to change now
let examScheduleId = ["4651","5721","6272"];  //dynamic no need to change now
let noOfSem = "8"; 
let stdOpenResFlag = "true";

let rollPrefix = "20242471";
 let studentRollNo =["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", 
"12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", 
"27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41"];


async function getStudentData(semID, examID, studRegID){
    let data = await fetch("https://iums.kuk.ac.in/restApi/fetchStudentDmcReport.json",{
        method: "POST",
        headers:{
            'User-Agent':'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:152.0) Gecko/20100101 Firefox/152.0',
'Accept':'application/json, text/javascript, */*; q=0.01',
'Accept-Language':'en-US,en;q=0.9',
'Accept-Encoding':'gzip, deflate, br, zstd',
'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
'X-Requested-With':'XMLHttpRequest',
'Origin':'https://iums.kuk.ac.in',
'Connection':'keep-alive',
'Referer':'https://iums.kuk.ac.in/anon_studentResultReport.htm',
'Cookie':`JSESSIONID=${sessionID}`,
'Sec-Fetch-Dest':'empty',
'Sec-Fetch-Mode':'cors',
'Sec-Fetch-Site':'same-origin',
'Priority':'u=0'
        },

body :`qualificationId=${qualificationId}&syllbusId=${syllbusId}&semesterId=${semID}&examScheduleId=${examID}&noOfSem=${noOfSem}&studentRegIds=${studRegID}&stdOpenResFlag=${stdOpenResFlag}`

      
    });
    data = await data.json();
    if(data.length > 0){
        let filePath = path.join(__dirname, `../studentMarks/${data[0][0].studentName}_${data[0][0].semester}.txt`);
        fs.writeFileSync(filePath, JSON.stringify(data[0][0], null, 2), 'utf8');
    }else{
        console.log("Array is empty, fix some changes");
    }

    ;
}


async function getStudentReg(rollNo){
    let studentReg = await fetch(`https://iums.kuk.ac.in/restApi/result/verify-student.json?examRollNumber=${rollNo}`, {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection" : "keep-alive",
        "Cookie" : `JSESSIONID=${sessionID}`,
        "X-Requested-With": "XMLHttpRequest",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "Priority": "u=0",
        "Host" : "iums.kuk.ac.in"
    },
    "referrer": "https://iums.kuk.ac.in/anon_studentResultReport.htm",
    "method": "GET",
    "mode": "cors"
});

    studentReg = await studentReg.json();
    let studentMbn  = studentReg[0].mbn;

//     let mobOtp = await fetch(`https://iums.kuk.ac.in/restApi/anon_sendOTPonMobileNumber.json?__mobileNo=${studentMbn}`, {
//     "credentials": "include",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0",
//         "Accept": "text/plain, */*; q=0.01",
//         "Accept-Language": "en-US,en;q=0.9",
//         "Connection" : "keep-alive",
//         "Cookie" : `JSESSIONID=${sessionID}`,
//         "X-Requested-With": "XMLHttpRequest",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "same-origin",
//         "Priority": "u=0",
//         "Host" : "iums.kuk.ac.in"
//     },
//     "referrer": "https://iums.kuk.ac.in/anon_studentResultReport.htm",
//     "method": "GET",
//     "mode": "cors"
// });

//     mobOtp = await mobOtp.text();
//     console.log("mobOtp : ", mobOtp);
   
    console.log("students data ",studentReg[0]);
    console.log("student mbn : ", studentMbn);
    return studentReg[0].std;
}


 async function callAPI(){
    for(i=0; i<studentRollNo.length; i++){
      let fullRollNumber = `${rollPrefix}${studentRollNo[i]}`;

      let studentRegIds = await getStudentReg(fullRollNumber.trim());

      for(j=0; j<semesterId.length; j++){
        await getStudentData(semesterId[j], examScheduleId[j], studentRegIds );
      }

      
    }
    
 }

 // callAPI();


// for(i=0; i<=41; i++){
//     if(i<=9){
//         console.log(`"0${i}", `);
//     }else{
//         console.log(`"${i}", `);
//     }
// }











// temp trial
 async function temp(){
    // for(i=0; i<studentRollNo.length; i++){
      let fullRollNumber = `${rollPrefix}${studentRollNo[27]}`;
      console.log(fullRollNumber);  // perfect

       let studentRegIds = await getStudentReg(fullRollNumber.trim());
       console.log(studentRegIds);

      for(j=0; j<semesterId.length; j++){
        await getStudentData(semesterId[j], examScheduleId[j], studentRegIds );
      }

      
   // }
    
 }

 temp();
