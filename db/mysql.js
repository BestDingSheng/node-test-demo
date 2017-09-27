var mysql = require('mysql');
var pool  = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'ding156561',
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


// 查找用户
let getuser = function( value ) {
  let _sql = "SELECT * FROM user_table WHERE (username,password)= (?,?)";
  return query( _sql, value )
}

// 查找所有用户

let getAlluser = function(){
  let _sql = "SELECT * FROM user_table";
  return query( _sql )
}


// 发表文章
let insertPost = function( value ) {
  let _sql = "insert into posts(name,title,content,uid,moment) values(?,?,?,?,?);"
  return query( _sql, value )
}


module.exports={
	query,
  getuser,
  getAlluser

}
