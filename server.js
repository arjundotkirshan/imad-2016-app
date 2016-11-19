var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles={
    'article-one':{
        title:'Article One | PK',
        heading:'Article One',
        date:'Sep 28,2016',
        content:
        `
             <p>This is article-one</p>
        `
                    
    },
    'article-two':{
        title:'Article Two | PK',
        heading:'Article Two',
        date:'Sep 28,2016',
        content:
        `
             <p>This is article-two</p>
        `
                    
    },
    'article-three':{
        title:'Article Three | PK',
        heading:'Article Three',
        date:'Sep 28,2016',
        content:
        `
             <p>This is article-Three</p>
        `
                    
    }

};

function createTemplate (data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;


        var htmlTemplate=`
            <html>
            <head>
                <title>
                   ${title}
                </title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div class="container">
                    <div>
                        <a href="/">Home</a>
                    </div>
                    <hr/>
                    <div>
                        <h3>${heading}</h3>
                    </div>
                    <div>
                        ${date}
                    </div>
                    <div>
                        ${content}
                    </div>
                </div>
            </body>
        </html>
        `;
return htmlTemplate;
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
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleName', function (req, res){
    var articleName=req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/ui/pk.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'pk.jpg'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
