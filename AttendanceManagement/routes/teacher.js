/**
 * Created by aman on 10/7/17.
 */
var express = require('express');
var router = express.Router();
var teacher=require('../models/teacher');
var student=require('../models/student');
var Attendance=require('../models/Attendance');
var teacherRegister=require('../models/teacherRegister');
var async=require('async');
//here it will be good if we store the id of techerregister for a particular teacher in her session
var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
router.use(isLoggedIn);

router.get('/index',function (req,res) {
    var err1=req.flash('atterr');
    var err2=req.flash('erratt');
   res.render('teacher/index',{err1:err1,err2:err2});
});
router.get('/takeattendance',function (req,res) {
    res.render('teacher/attendanceconfig');
});
router.post('/takeattendance',function (req,res) {
    let x=req.body.BranchName;
    let y=req.body.Subject;
    let z=req.body.Semester;
    let email=req.user.email;
    let date=req.body.Date;
    let actdate=(new Date(date)).getTime();
    let id;

    teacherRegister.findOne({Branch:x,Semester:z,Subject:y,Teacher:email}).populate('Teacher').exec(function(err,att){
        //console.log(att);

        if(err)
            throw err;
        if(!att){
            req.flash('atterr','Cant give u access for the class whose info u just gave');
            return res.redirect('/teacher/index');
        }


        else {
            id=att._id;
            //implies hat we can give teacher acccess to take attendance
            //find the students
            Attendance.findOne({Date: actdate, id: id}).populate({
                path: 'Students.Student',
                model: 'Student'
            }).exec(function (err, result) {
                if (err)
                    throw err;

                if (!result) {
                    console.log("hello");
                    let obj={};
                    obj.Students=[];
                    obj.id=id;
                    obj.Date=actdate;

                    var stu=[];
                    student.find({BranchName:x,CurrentSemester:z},function (err,students) {
                        if(err)
                            throw err;

                        students.forEach(function(student){
                            obj.Students.push({Student:student._id,Present:false});
                            stu.push({Name:student.name,Id:student._id});
                        });

                        let attendance=new Attendance(obj);

                        attendance.save(function (err,result) {
                            if(err)
                                throw err;
                            else{
                                return res.render('teacher/attendance',{Branch:x,Semester:z,Subject:y,Date:date,students:stu});
                            }
                        });
                    })

                }
                else{
                    console.log("HI");
                        console.log(result.Students);
                        let stu=[];
                        let studentarray=result.Students;

                        studentarray.forEach(function (stud) {
                            let obj={Name:stud.Student.name,Id:stud.Student._id,Present:stud.Present};
                            stu.push(obj);
                        });
                        return res.render('teacher/attendance',{Branch:x,Semester:z,Subject:y,Date:date,students:stu});
                }
            });
        }
    });
});
router.post('/edit',function (req,res) {
    let x=req.body.studentid;
    let y=req.body.present;
    let z=req.body.date;

    let a=req.body.branchname;
    let b=req.body.semester;
    let c=req.body.subject;
    if(y!=0){
        y=true;
    }
    else{
        y=false;
    }
    console.log("hi");
    teacherRegister.findOne({Branch:a,Semester:b,Subject:c,Teacher:req.user.email}, //or we can store the id o teacherregister in session or hide at frontend
        function (err,result) {

        if(err)
            throw err;
        if(!result){
            req.flash('atterr','Cant give u access for the class whose info u just gave');
            return res.redirect('/teacher/index');
        }

        let id=result._id;

        Attendance.update({id:id,Date:((new Date(z)).getTime()),Students:{$elemMatch:{Student:x}}},{'$set':{'Students.$.Present':y}},function (err,result) {
            console.log(result);
            if(err)
                throw err;
            else{
                let data={done:true};
                return res.send(data);
            }
        })

    });
});

router.post('/saveattendance',function (req,res) {
    req.flash('erratt','Successfully taken the attendance');
    res.redirect('/teacher/index');
});


module.exports = router;

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        if(req.user.category=="teacher")
            return next();
    }
    else
        res.redirect('/');
}