//Required Libraries
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto=require('crypto');
var Pool = require('pg').Pool;
var bodyParser=require('body-parser');
var session=require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'asfdd@waikiDuk@nrewqasfdd@waikiDuk@nrew',
    cookie:{maxAge:1000*60*60*24*30}
}));

//database connection is defined here
var config={
    user:process.env.IMADUSER || 'arjundotkirshan',
    database:process.env.IMADDB || 'arjundotkirshan',
    host:process.env.IMADHOST || 'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.IMADPASSWORD || process.env.DB_PASSWORD
};

/* All the global variables 
var users = [];
var comments = [];
var posts = [];
var counter;
var pool = new Pool(config);

get_posts();
get_comments();
get_users();
 commented for a while as it is creating app crash*/


function createTemplate (data){
    var title = data.title;
    var date = data.date;
    var heading = data.heading;
    var content = data.content;

        var htmlTemplate=`
           <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Nodejs WebApp Development</title>
            <link href="css/bootstrap.min.css" rel="stylesheet">
            <link href="css/clean-blog.min.css" rel="stylesheet">
            <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css">
            <link href='//fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
            <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
            <link href="css/modal.css" rel="stylesheet">
            <link href="css/post-comment.css" rel="stylesheet">
        </head>
            <body>
    `;
    for (var i = 0; i < comments.length; i++) {
                if (comments[i].comment_author === username){ 
                  htmlTemplate = htmlTemplate +  `
                   <div class="col-sm-8 col-sm-offset-2">
                        <div class="panel panel-white post panel-shadow">
                            <div class="post-heading">
                                <div class="pull-left image">
                                    <a href=/user/`+comments[i].comment_author+`><img src="http://bootdey.com/img/Content/user_`+findUser(comments[i].comment_author).displaypic+`.jpg" class="img-circle avatar" alt="user profile image"></a>
                                </div>
                                <div class="pull-left meta">
                                    <div class="title h5">
                                        <a href=/user/`+comments[i].comment_author+`><b>`+comments[i].comment_author+`</b></a> made a comment.
                                    </div>
                                    <h6 class="text-muted time">`+(comments[i].comment_date).toGMTString()+`</h6>
                                </div>
                            </div> 
                            <div class="post-description"> 
                                <p>`+comments[i].comment_content+`</p>
                            </div>
                        </div>
                    </div>
                            
                       ` ;
                   }
               }

       htmlTemplate = htmlTemplate + `
</body>
       	            <script src="js/jquery.min.js"></script>
            <script src="js/bootstrap.min.js"></script>
            <script src="js/clean-blog.min.js"></script>
            <script src="js/main.js"></script>
            <script src="js./article.js"></script>
        </body>
        </html>
        `;
return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input, salt){
    var hashed=crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return["pbkdf2", "10000", salt, hashed.toString('hex')].join('$') ;
}
app.get('/hash/:input', function(req, res){
    var hashedString=hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});

app.post('/create-user', function(req, res){
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password, salt);
    pool.query('INSERT INTO "user"(username, password) VALUES ($1, $2)',
    [username, dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send('User successfully created:'+username);
        }
    });
});

app.post('/login', function(req, res){
    var username=req.body.username;
    var password=req.body.password;
    
    pool.query('SELECT * FROM "user" WHERE username=$1', [username], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.send(403).send('username/password is invalid');
            }else{
                var dbString=result.rows[0].password;
                var salt=dbString.split('$')[2];
                var hashedPassword=hash(password, salt);
                if(hashedPassword===dbString){
                    //set the session
                    req.session.auth={userId:result.rows[0].id};
                    res.send('credentials correct!');
                }else{
                    res.send(403).send('username/password is invalid');
                }
            }
        }
    });
});

app.get('/check-login', function(req, res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send('you are logged in:'+ req.session.auth.userId.toString());
    }else{
        res.send('You are not logged in');
    }
});

app.get('/logout', function(req, res){
    delete req.session.auth;
    res.send('Logged out');
});

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



app.get('/articles/:articleName', function (req, res){
   pool.query("SELECT * FROM article WHERE title='"+req.params.articleName+"'", function(err, result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           if(result.rows.length===0){
               res.status(404).send('Article not found');
           }else{
               var articleData=result.rows[0];
               res.send(createTemplate(articleData));
           }
       }
   });
});


/* Define all the routes here*/
app.use("/css", express.static(__dirname+'/ui/css'));
app.use("/img", express.static(__dirname+'/ui/img'));
app.use("/js", express.static(__dirname+'/ui/js'));
app.use("/fm_internet", express.static(__dirname+'/ui/fm_internet'));

app.get('/', function (req, res) {
    get_posts();
    res.send(homeTemplate());
});

app.get('/posts', function (req, res) {
    res.redirect('/');
});

app.get('/index.html', function (req, res) {
    res.redirect('/');
});

app.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

app.get('/contact', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
});

app.get('/main.js', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/article.js', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});

app.get('/favicon.ico', function (req, res){
    res.sendFile(path.join(__dirname, 'ui/img', 'favicon.ico'))
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});