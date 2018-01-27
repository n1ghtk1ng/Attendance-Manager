/**
 * Created by aman on 28/6/17.
 */

//if we require passprt in 2 different files the configuration we apply in one file say app.js(passport.initialize && session) will be available in other file i.e.this file
var passport=require('passport');
var User=require('../models/user');
var Student=require('../models/student');
var Teacher=require('../models/teacher');
var LocalStrategy=require('passport-local').Strategy;


passport.serializeUser(function (user,done) {
    done(null,user.id);//whenever we wanna store user in our session,we serialize the user by his id
});

passport.deserializeUser(function (id,done) {  //retrieval of the user through thr stored id
    User.findById(id,function (err,user) {
        done(err,user);
    })
});
passport.use('local.signup',new LocalStrategy(//signup strategy used when i wanna create a new user
    {usernameField:'email',
        passwordField:'password',
        passReqToCallback:true},function (req,email,password,done) {  //configuration && callback //by passReqToCallback:true we can send req object in the mentioned callback first
        req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
        req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4});

        var errors = req.validationErrors();

        if (errors) {
            var messages = [];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
        //check in the user model if the user already exists
        User.findOne({'email': email}, function (err, user) {

            if (err) {
                return done(err);
            }
            if (user) {
                if (!user.password) {
                    user.password = user.encryptPassword(password);

                    user.save(function (err, result) {
                        if (err)
                            return done(err);
                        return done(null, user);
                    })
                }
                else
                    return done(null, false, {message: 'Email is already in use'}); //this message is stored in the req object in 'error' field by flash
            }
            else {
                // let user = new User({email: email, category: "admin"});
                // user.password = user.encryptPassword(password);
                // user.save(function (err, result) {
                //     if (err)
                //         return done(err);
                //     return done(null, user);

                return done(null, false, {message: 'Can`t provide access to u! sorry!'}); //this message is stored in the req object in 'error' field by flash
            }
        });
    }));

passport.use('local.signin',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },function (req,email,password,done) {
        req.checkBody('email','Invalid Email').notEmpty().isEmail();
        req.checkBody('password','Invalid Password').notEmpty();

        var errors=req.validationErrors();

        if(errors){
            var messages=[];
            errors.forEach(function (error) {
                messages.push(error.msg);
            });
            return done(null,false,req.flash('error',messages));
        }
        User.findOne({'email':email},function (err,user) {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null,false,{message:'No User Found'}); //this message is stored in the req object in 'error' field by flash
            }
            if(user){
                if(!user.password){
                    return done(null,false,{message:'Please Signup First'});
                }
                else if(!user.validPassword(password)){
                    return done(null,false,{message:'Wrong Password'})
                }
                return done(null,user);
            }

        })

    })
);