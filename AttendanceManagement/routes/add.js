var express=require('express');
var router=express.Router();
var Student=require('../models/student');
var Teacher=require('../models/teacher');
var User=require('../models/user');
var Attendance=require('../models/teacherRegister');
var async=require('async');

//while adding teacher i have assumed that one one teacher teaches particular subject to a particular class
//if we add teacher with same class and subject as another teacher , that eacher wil be added in teachers model but not in teacherregister model

// here also assumed that everyone enters their own unique email address and their own info,,, checking for student or teacher in db is done
//on the basis of email
router.use(isLoggedIn);

router.get('/student',function (req,res) {
    var messages=req.flash('adderror');
    res.render('admin/add',{student:true,messages: messages, hasErrors: messages.length > 0})
});

router.get('/teacher',function (req,res) {
    var messages=req.flash('adderrort');
    res.render('admin/add',{teacher:true, messages: messages, hasErrors: messages.length > 0})
});

router.post('/student',function (req,res) {
    req.checkBody('address','Invalid Address').notEmpty();
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('DOB','Invalid DateofBirth').notEmpty().isDate();
    req.checkBody('name','Invalid Student Name').notEmpty();
    req.checkBody('fname','Invalid Father`s Name').notEmpty();
    req.checkBody('mname','Invalid Mother`s Name').notEmpty();
    req.checkBody('phoneNo','Invalid PhoneNo').notEmpty().isNumeric().isLength({min:10,max:10});
    req.checkBody('YearOfAdmission','Invalid YearOfAdmission').notEmpty().isNumeric();
    req.checkBody('BranchName','Invalid BranchName').notEmpty();
    req.checkBody('CurrentSemester','Invalid Semester').notEmpty();

    var errors=req.validationErrors();

    if(errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        req.flash('adderror', messages);
        return res.redirect('/add/student');
        //return res.render('admin/add', {student: true, messages: messages, hasErrors: messages.length > 0})
    }

    User.findOne({'email':req.body.email},function (err,student) {
       if(err){
           throw err;
       }
       if(student){
           req.flash('adderrorstu', 'Student with this email already exists');
           return res.redirect('/admin/index');
           //return res.render('admin/add',{student:true,haserror:true,error:'Student with this email already exists'});
       }
       else{

           let student=new Student();
           student.name=req.body.name;
           student.address=req.body.address;
           student.PhoneNo=req.body.phoneNo;
           student.DOB=req.body.DOB;
           student.FatherName=req.body.fname;
           student.MotherName=req.body.mname;
           student.email=req.body.email;
           student.YearOfAdmission=req.body.YearOfAdmission;
           student.BranchName=req.body.BranchName;
           student.CurrentSemester=req.body.CurrentSemester;
           let newUser=new User();
           newUser.email=req.body.email;
           newUser.category="student";

           student.save(function (err,result) {
               if(err){
                   console.log(student);
                   console.log(result);
                   throw err;
               }
               else{
                   newUser.save(function (err,result) {
                       if(err)
                           throw err;
                       else{
                           req.flash('successstu', 'Successfully Added a student');
                           return res.redirect('/admin/index');
                           //return res.render('admin/index',{msg:'Successfully Added a student'});
                       }
                   });
               }
           })
       }
    });

});

router.post('/teacher',function (req,res) {
    req.checkBody('address','Invalid Address').notEmpty();
    req.checkBody('email','Invalid Email').notEmpty().isEmail();
    req.checkBody('DOB','Invalid DateofBirth').notEmpty().isDate();
    req.checkBody('name','Invalid Teacher Name').notEmpty();
    req.checkBody('fname','Invalid Father`s Name').notEmpty();
    req.checkBody('mname','Invalid Mother`s Name').notEmpty();
    req.checkBody('phoneNo','Invalid PhoneNo').notEmpty().isNumeric().isLength({min:10,max:10});
    req.checkBody('DateOfJoining','Invalid DateOfJoining').notEmpty().isDate();
    req.checkBody('BranchName','Invalid BranchName').notEmpty();
    req.checkBody('Semester','Invalid Semester').notEmpty();
    req.checkBody('Subject','Invalid Subject').notEmpty();

    var errors=req.validationErrors();

    if(errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        req.flash('adderrort', messages);
        return res.redirect('/add/teacher');
    }

    User.findOne({'email':req.body.email},function (err,teacher) {
        if(err){
            throw err;
        }
        if(teacher){
            req.flash('adderrortea', 'Teacher with this email already exists');
            return res.redirect('/admin/index');
        }
        else{

            let teacher=new Teacher();
            teacher.name=req.body.name;
            teacher.address=req.body.address;
            teacher.PhoneNo=req.body.phoneNo;
            teacher.DOB=req.body.DOB;
            teacher.FatherName=req.body.fname;
            teacher.MotherName=req.body.mname;
            teacher._id=req.body.email;
            teacher.DateOfJoining=req.body.DateOfJoining;

            let x=req.body.BranchName;
            let y=req.body.Semester;
            let z=req.body.Subject;
            let temp=req.body.infoentries;
            let teacherid;

            teacher.save(function (err,result) {
                if (err) {
                    throw err;
                }
                teacherid=result._id;
                let newUser=new User();
                newUser.email=req.body.email;
                newUser.category="teacher";

                newUser.save(function (err,result) {
                    if(err)
                        throw err;
                    if(temp==1) {
                        Attendance.findOne({
                            Branch:x,
                            Semester:y,
                            Subject:z
                        },function(err,teacher){
                            if(teacher){
                                req.flash('adderrortea', 'Teacher with this email already exists');
                                return res.redirect('/admin/index');
                            }
                            else{
                                let attendance = new Attendance({
                                    Branch: x,
                                    Semester: y,
                                    Subject: z,
                                    Teacher: teacherid
                                });
                                attendance.save(function (err, result) {
                                    if (err)
                                        throw err;
                                    console.log(result);

                                    req.flash('successtea', 'Successfully Added a teacher');
                                    return res.redirect('/admin/index');
                                });
                            }
                        });
                    }

                    else{
                        let obj=[];
                        for(var i=0;i<temp;i++) {
                            let attendance = {
                                Branch: x[i],
                                Semester: y[i],
                                Subject: z[i],
                            };
                            obj.push(attendance);
                        }

                        let it=0;
                        let error=false;
                        async.each(obj,function (object,cb) {
                            Attendance.findOne(object,function (err,result) {
                                console.log(result);

                                if(result){
                                    error==true;
                                    console.log("hi");
                                    it++;
                                    if(it==obj.length){
                                        req.flash('successtea', 'Successfully Added a teacher though some teaching info were already present and not added for this teacher');
                                        return res.redirect('/admin/index');
                                    }
                                }
                                else{
                                    console.log("HI");
                                    object.Teacher=teacherid;
                                    let att=new Attendance(object);
                                    att.save(function (err,result) {
                                        if(err)
                                            throw err;
                                        it++;
                                        if(it==obj.length){
                                            if(error==true)
                                                req.flash('successtea', 'Successfully Added a teacher though some teaching info were already present and not added for this teacher');
                                            else
                                                req.flash('successtea', 'Successfully Added a teacher with all teaching info');
                                            return res.redirect('/admin/index');

                                        }
                                    })
                                }
                            });

                        },function(err){
                            if(err)
                                throw err;
                        });

                    }

                });

            });
        }
    });

});
module.exports = router;
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        if(req.user.category=="admin")
        return next();
        else if(req.user.category=="student"){
            return res.redirect('/student/index')
        }
        else if(req.user.category=="teacher"){
            return res.redirect('/teacher/index')
        }
    }
    else
        res.redirect('/');
}
