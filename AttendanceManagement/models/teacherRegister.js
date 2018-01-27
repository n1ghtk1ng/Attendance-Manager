/**
 * Created by aman on 12/7/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var Teacher=require('../models/teacher');


var teacherAttendanceInfo=new Schema(
    {
        Branch:{type:String,required:true},
        Semester:{type:String,required:true},
        Subject:{type:String,required:true},
        Teacher:{type:String,ref:'Teacher'},
    }
);
module.exports=mongoose.model('TeacherRegister',teacherAttendanceInfo);