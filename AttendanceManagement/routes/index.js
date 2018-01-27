var express = require('express');
var router = express.Router();
/* GET home page. */

router.get('/', function(req, res, next) {

res.render('index');
});


module.exports = router;


// function isLoggedIn(req,res,next) {
//     if(req.isAuthenticated()){
//         return next();
//     }
//     //creating an oldUrl object oursleves(name of ur choice)
//     req.session.oldUrl=req.url;
//
//     res.redirect('/user/signin');
// }
