/**
 * Created by aman on 7/7/17.
 */
var express=require('express');
var router=express.Router();
var add=require('./add');

router.use(isLoggedIn);
router.get('/index',function (req,res) {

    var msgs=req.flash('adderrorstu');
    var msgt=req.flash('adderrortea');
    var successs=req.flash('successstu');
    var successt=req.flash('successtea');
    res.render('admin/index',{msgs:msgs,successs:successs,successt:successt,msgt:msgt});
});

router.use('/add',add);

module.exports=router;

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        if(req.user.category=="admin")
            return next();
    }
    else
        res.redirect('/');
}