/**
 * Created by aman on 7/7/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var teacherschema=new Schema({
    _id:{type:String,required:true},
    name:{type:String,required:true},
    address:{type:String,required:true},
    PhoneNo:{type:String,required:true},
    DOB:{type:Date,required:true},
    FatherName:{type:String,required:true},
    MotherName:{type:String,required:true},
    DateOfJoining:{type:Date,required:true},

});
module.exports=mongoose.model('Teacher',teacherschema);
