var express = require('express');
var router = express.Router();
var moment = require('moment');
var dbModel = require('../db/mysql');

/* GET users listing. */


//  注册

router.post('/adduser', function(req, res) {

  let username = req.body.username;
  let password = req.body.password;

  if (username == '' || password == '') {
    res.json({
      'msg': '账号密码不能为空',
      code: 300
    });
    return;
  }
  // console.log(req.body);
  // 从数据库中查找是否有这个账户
  dbModel.getuser([`${username}`]).then(results => {
    if (results.length > 0) {
      res.json({
        'msg': '此用户已注册快去登入吧',
        'code': '100'
      })
    } else {
      dbModel.adduser([`${username}`, `${password}`]).then(results => {
        if (results.insertId > 0) {
          res.json({
            'msg': '注册成功快去登录吧',
            'code': '200'
          });
        } else {
          res.json(results);
        }
      }).catch(err => {
        console.log(err);
      })
    }
  })

})

// 登陆

router.post('/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  if (username == '' || password == '') {
    res.json({
      'msg': '账号密码不能为空',
      code: 300
    });
    return;
  }

  dbModel.login([`${username}`, `${password}`]).then(results => {
    if (results.length > 0) {
      res.cookie('name',username);
      res.json({
        'msg': '登陆成功',
        'code': '200'
      })
    } else {
      res.json({
        'msg': '账号密码错误',
        'code': '100'
      })
    }
  })
})
//  退出
router.get('/exit', function(req, res) {
    res.clearCookie('name');
    // res.send({code:'000000'})
    res.redirect('/login');
});

router.post('/post',function(req,res){
  let username = req.body.username;
  let content  = req.body.content;
  let date = moment().format('YYYY-MM-DD HH:mm:ss');


// return;
  dbModel.insertPost([`${username}`,`${content}`,`${date}`]).then(results=>{

    if(results.insertId>0){
      res.json({'msg':'留言成功',code:200})
    }else{
      res.json({'msg':'留言失败稍后再试',code:100})
    }
  })
})






module.exports = router;
