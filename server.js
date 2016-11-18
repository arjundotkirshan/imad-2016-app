var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articleOne={
    title:'Article One I PK',
    heading:'Article One',
    date:'Sep 28,2016',
    content:
    `
    
                <p>Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.</p>
                <p>Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.</p>
                <p>Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.Once upon a time there was a king.</p>
  `
}

var Pool = require('pg').Pool;

var config={
    user:'arjundotkirshan',
    database:'arjundotkirshan',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var pool=new Pool(config);
app.get('/test-db', function (req, res){
    pool.query('SELECT * FROM test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result));
        }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/article-one', function (req, res){
     res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});

app.get('/article-two', function (req, res){
   res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});

app.get('/article-three', function (req, res){
   res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/pk.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'pk.jpg'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
