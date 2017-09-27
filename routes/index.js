var express = require('express');
var router = express.Router();
var dbModel = require('../db/mysql');


// 响应一个JSON数据
var responseJSON = function (res, ret) {
     if(typeof ret === 'undefined') {
          res.json({     code:'-200',     msg: '操作失败'
        });
    } else {
      res.json(ret);
  }};



  router.get('/exit', function(req, res, next) {

      res.clearCookie('name');
      res.send({code:'000000'})


});



  router.get('/', function(req, res, next) {

      if(req.cookies.name){
        // res.render('admin/index')

        dbModel.getAlluser().then(results=>{

          console.log(results);

          res.render('admin/index',{
            name:req.cookies.name,
            data:results,
          });


        })

      }else{
        res.redirect('/login');
      }

  });





/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('admin/login', { title: '用户登录' });
});

router.get('/reg', function(req, res, next) {
  res.render('admin/rej',{
    title:'用户注册'
  });
});






// api 


router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;
  dbModel.getuser([`${username}`,`${password}`]).then(results=>{

    console.log(results);

    if(results.length==0){
      res.send('密码错误');
    }else{
      res.cookie('name',username);
      res.redirect('/');
    }

    responseJSON(res,results)
  })

});


module.exports = router;
