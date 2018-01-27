/**
 * Created by aman on 2/7/17.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');

var userschema=new Schema({
    email:{type:String,required:true},
    password:{type:String},
    category:{type:String,required:true}
});

userschema.methods.encryptPassword=function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};
userschema.methods.validPassword=function (password) {
return bcrypt.compareSync(password,this.password);
};

module.exports=mongoose.model('User',userschema);