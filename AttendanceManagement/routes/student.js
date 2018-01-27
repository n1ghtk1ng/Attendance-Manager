/**
 * Created by aman on 10/7/17.
 */
var express = require('express');
var router = express.Router();
var teacher=require('../models/teacher');
var student=require('../models/student');
var Attendance=require('../models/Attendance');
var teacherRegister=require('../models/teacherRegister');

var Handlebars = require('handlebars');
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
router.use(isLoggedIn);
router.get('/index',function (req,res) {
    res.render('student/index');
});

router.get('/viewattendance',function (req,res) {
    var err1=req.flash('err1');
    res.render('student/attendanceconfig',{err1:err1});
});

router.post('/viewattendance',function (req,res) {
    let subject=req.body.Subject;
    let studid;
    let attrecord;
    student.findOne({email:req.user.email},function (err,student) {
        if(err)
            throw err;
        studid=student._id;
        console.log(studid);
        teacherRegister.findOne({Branch:student.BranchName,Semester:student.CurrentSemester,Subject:subject},function (err,result) {
            if(err)
                throw err;
            if(!result){
                req.flash('err1',"wrong subject entered");
                return res.redirect('/student/viewattendance');
            }
            attrecord=result._id;


            Attendance.find({id:attrecord},function (err,records) {

                let response=[];
                for(let i=0;i<records.length;i++){
                    let obj={Date:getdate(records[i].Date)};
                    let arr=records[i].Students;
                    let flag=0;

                    for(let j=0;j<arr.length;j++){
                        if(studid.equals(arr[j].Student)){//here we cant use simple == method to compare ids in mongodb , soo use .equals moethod
                            obj.Present=arr[j].Present;
                            flag=1;
                        }
                    }
                    if(flag==0){
                        obj.Present=false;
                    }
                    response.push(obj);
                }
                console.log(response);
                res.render('student/viewattendance',{att:response,Subject:subject});

            });
        })
    })

});

module.exports = router;

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        if(req.user.category=="student")
            return next();
    }
    else
        res.redirect('/');
}

function getdate(date){
   let d=new Date(date);
   let x=d.toString();
   let ans="";
   let space=0;
   for(var i=0;i<x.length;i++){
       if(x[i]==' '){
           space++;
           if(space>=4){
                break;
           }
       }
       ans+=x[i];
   }
return ans;
}