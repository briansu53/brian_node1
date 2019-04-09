const express = require('express');
const app = express();

const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));


//middleware
var url = require('url'); //?
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false}); //?

//mysql
var mysql= require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: '',
  database: 'ps1002'
});
db.connect();
app.get('/data',(req,res)=>{
  var sql= "SELECT * FROM `test10` WHERE 1";
  db.query(sql, function(error, results, fields){
    if(error)throw error;
    console.log(results);
    res.render('page2',{
      sales: results
    })
  });
});

var moment = require('moment');
app.get('/page2', (req, res)=>{
  var sql="SELECT * FROM `test10`"; //why沒有加where 1
  db.query(sql, function(error,results,fields){
    if(error) throw error;
    results.forEach(el=>{
      el.birthday = moment(el.birthday).format('YYYY/MM/DD');
    });//el是甚麼
    res.render('page2',{
      sales:results
    });
  });
});

//mysql Create
//前端-繪製新增資料表單介面
app.get('/data/add',(req,res)=>{
  res.render('sales2_add');
});
app.post('/data/add',urlencodedParser,(req,res)=>{
  let sql = `INSERT INTO test10(
    sid, sales_id, name, birthday) 
  VALUES (?,?,?,NOW());`;
  db.query(sql,[req.body.sales_id, req.body.name, req.body.birthday],(error,results,fields)=>{
    if(error){
      throw error;
    }
    res.json(results);
  });
});

//刪除
app.get('/data/delete/:sid', (req, res)=>{
  let sql = `DELETE FROM test10 WHERE sid=?`;

  db.query(sql, [req.params.sid],(error, results,fields)=>{
    if(error){
      throw error;
    }
    res.json(results);
  });
});

//編輯資料
app.get('/data/edit/:sid',(req,res)=>{
  let sql = `SELECT * FROM test10 WHERE sid=?`;
  db.query(sql, [req.params.sid],(error, results, fields)=>{
    if(error){
        throw error;
    };
    console.log(results[0]);
    results[0].birthday = moment(results[0].birthday).format('YYYY-MM-DD');
    res.render('sales2_edit', {
      item: results[0]
    });
  });
});

app.post('/data/edit/:sid', urlencodedParser, (req, res)=> {
  let sql = "UPDATE `test10` SET `sales_id`=?,`name`=?,`birthday`=? WHERE sid=?";

  db.query(sql, [
      req.body.sales_id,
      req.body.name,
      req.body.birthday,
      req.params.sid
  ], (error, results, fields)=>{
      if(error){
          throw error;
      }
      res.json(results);
  });
});


app.listen(3000, function(){
  console.log('hi server start!')
});