var express = require('express');
var router = express.Router();
var moment = require('moment');
var dbModel = require('../db/mysql');

// 响应一个JSON数据
var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};

router.get('*', function(req, res, next) {
  // 到注册页面不跳转
  if (req.url == '/reg') {
    res.render('admin/rej', {
      title: '用户注册',
      name: req.cookies.name,
    });
    return;

  }
  if (req.url != '/login' && !req.cookies.name) {
    res.redirect('/login');
  }
  // console.log(req.cookies.name);
  next();
})

// 首页
router.get('/', function(req, res, next) {
  if (req.cookies.name) {
    let curPage = req.query.page-1 || 0;
    dbModel.getAlluser([curPage]).then(results => {
      dbModel.getAlluserCount().then(count=>{
        let totalCount = count[0]['COUNT(1)'];
        let totalPage =  Math.ceil(totalCount/10);
        res.render('admin/index', {
          name: req.cookies.name,
          data: results,
          totalPage:totalPage,
          curPage:curPage,
          title: '首页'
        });
      })
    })
  } else {
    res.redirect('/login');
  }

});

// 留言板
router.get('/board', function(req, res, next) {
  res.render('admin/board', {
    title: '留言板',
    name: req.cookies.name,
  });
});


// 登陆
router.get('/login', function(req, res, next) {
  res.render('admin/login', {
    title: '用户登录',
    name: req.cookies.name,
  });
});

// 注册
router.get('/reg', function(req, res, next) {
  res.render('admin/rej', {
    title: '用户注册',
    name: req.cookies.name,
  });
});

// 查看留言板

router.get('/planList', function(req, res) {
  let curPage = req.query.page-1 || 0;

  console.log(curPage);
  dbModel.getAllPost([curPage]).then(results => {
    dbModel.getAllPostCount().then(count=>{
      for(let i=0;i<results.length;i++){
        results[i].date=moment(results[i].date).format('YYYY-MM-DD HH:mm:ss');
      }
      let totalCount = count[0]['COUNT(1)'];
      let totalPage =  Math.ceil(totalCount/10);
      res.render('admin/planList', {
        title: '查看留言板',
        data: results,
        name: req.cookies.name,
        totalPage:totalPage,
        curPage:curPage
      });

    })






  })

})






// api

module.exports = router;
