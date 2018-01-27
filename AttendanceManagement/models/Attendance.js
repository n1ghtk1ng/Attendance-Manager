/**
 * Created by aman on 7/7/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var Student=require('../models/student');


var AttendanceSchema=new Schema({
    id:{type:Schema.Types.ObjectId,ref:'TeacherRegister'},
    Date:{type:Number,required:true},
    Students:[
        {
            Student:{type:Schema.Types.ObjectId,ref:'Student'},
            Present:{type:Boolean}
        }
    ]


});
module.exports=mongoose.model('Attendance',AttendanceSchema);
