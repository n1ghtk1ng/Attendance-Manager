/**
 * Created by aman on 5/7/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var studentschema=new Schema({
    name:{type:String,required:true},
    address:{type:String,required:true},
    PhoneNo:{type:String,required:true},
    DOB:{type:Date,required:true},
    FatherName:{type:String,required:true},
    MotherName:{type:String,required:true},
    email:{type:String,required:true},
    YearOfAdmission:{type:Number,required:true},
    BranchName:{type:String,required:true},
    CurrentSemester:{type:String,required:true}
});

module.exports=mongoose.model('Student',studentschema);