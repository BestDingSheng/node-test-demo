var mysql = require('mysql');
var pool  = mysql.createPool({
  host: '47.95.235.183',
  user: 'root',
  password: '',
  database:'blog', // 前面建的user表位于这个数据库中
  port: 3306
});

let query = function( sql, values ) {

  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        resolve( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}


//  注册 查找用户是否存在
let getuser = function( value ) {
  let _sql = "SELECT * FROM user_table WHERE (username)= (?)";
  return query( _sql, value )
}

// 数据储存用户

let adduser = function( value ) {
  // let _sql = "SELECT * FROM user_table WHERE (username)= (?)";
  let _sql = "insert into user_table (username,password) values (?,?)";
  return query( _sql, value )
}


// 登陆
let login = function( value ) {
  let _sql = "SELECT * FROM user_table WHERE (username,password)= (?,?)";
  return query( _sql, value )
}

// 查找所有用户

let getAlluser = function(value){
  let starCount= value*10;
  let endCount = 10;
  let _sql = `SELECT * FROM user_table order by id desc limit ${starCount},${endCount}`;
  return query( _sql )
}
//  用户总数
let getAlluserCount = function(){
  let _sql = 'SELECT COUNT(1) FROM user_table';
  return query( _sql )
}


// 添加留言
let insertPost = function( value ) {
  let _sql = "insert into post (username,content,date) values(?,?,?)";
  return query( _sql, value )
}

// 查找所有留言

let getAllPost =  function(value){
  let starCount= value*10;
  let endCount = 10;
  let _sql = `SELECT * FROM post order by uid desc limit ${starCount},${endCount}`;
  return query( _sql )
}


//  留言总数
let getAllPostCount = function(){
  let _sql = 'SELECT COUNT(1) FROM post';
  return query( _sql )
}


module.exports={
	query,
  getuser,
  adduser,
  login,
  getAlluser,
  insertPost,
  getAllPost,
  getAlluserCount,
  getAllPostCount

}
