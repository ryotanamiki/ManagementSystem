const path = require('path');
const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const mysql = require('mysql2');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'express_db'
});

// mysqlからデータを持ってくる
app.get('/', (req, res) => {
  const sql = "select * from personas";
  // 参考例
  const num = 10000;

  // ==========ここまでの範囲で書くようにしましょう。==========
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    res.render('index', {
      users: result,
      number: num,
    });
  });
});

app.get('/edit/:id', (req, res) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  con.query(sql, [req.params.id], function (err, result, fields) {
    if (err) throw err;
    res.render('edit', {
      user: result
    });
  });
});


app.post('/', (req, res) => {
  const sql = "INSERT INTO users SET ?"
  con.query(sql, req.body, function(err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, 'html/form.html'))
});

app.post('/update/:id', (req, res) => {
  const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
  con.query(sql, req.body, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  con.query(
    sql, [req.params.id],
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      res.redirect('/');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));