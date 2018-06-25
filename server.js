var express = require('express');	//load the express library
var app = express();	//create new variable called app and pass the express function
var port = 8888;

var mongoose = require('mongoose');		//load the mongoose module

var bodyParser = require('body-parser');

var bcrypt = require('bcrypt-nodejs');

var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

//passport is the authentication middleware for Node
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//whenever you do a post request from the form, it gets
//the data through a URL encoded format. This happens
//by default.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use('/js', express.static(__dirname + '/js')); 
app.use(express.static('Sample'));

		//connecting our scripts

//initializing sessions
app.use(cookieParser());	//gives us cookies for the session

app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2']
}));

//initializing passport
app.use(passport.initialize());
//used for persisting login sessions
app.use(passport.session());


//connect the database to the node application
var username = 'admin';
var password = '123456';

var dbHost = 'localhost';
var dbPort = '27017';
var database = 'first_db';

//connection string to our mongodb connection
var url = 'mongodb://' + username + ':' + password + '@' + dbHost + ':' + dbPort + '/' + database;
console.log('mongodb connection = ' + url);

//establishing our database connection
mongoose.connect(url, function(err) {
    if(err) {
        console.log('connection error: ', err);
    } else {
        console.log('connection successful');
    }
});

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

//Create the User Model to which we will save the Data
//User model - model is nothing but a table
//we are defining all our fields below
//we assign it to a variable UserSchema
var UserSchema = new mongoose.Schema({
     _id: mongoose.Schema.ObjectId,
     username: String,
     password: String
 });

//we are creating a model object as defined from our userSchema
//we'll use this variable for our queries
var User = mongoose.model('user', UserSchema);


//the below function app.get(path, callback) is used to render routes.
//get() method tells us that we're using a GET request
app.get('/', function (req, res, next) {		
 res.sendFile( __dirname + '/index.html');
});


//the route to the register page
app.get('/register', function (req, res, next) {
    res.sendFile( __dirname + '/register.html');
});

app.get('/home',  function(req, res, next) {
	res.sendFile(__dirname + '/home.html');
});

//throw back our User data to the HTML via json string
app.get('/user', function (req, res, next) {
	console.log('Cookies');
	/*User.findOne({id: req.user.id}, function(err, user) {
		return res.json(user);
	});*/
});

app.get('/registeredMessage', function(req,res,next) {
	res.sendFile(__dirname + '/registeredMessage.html');
});

//authenticating if user is valid
//creating a POST method each time the log in button is clicked
app.post('/login', passport.authenticate('local'),
    function(req, res) {
        res.redirect('/home');
});

passport.use(new LocalStrategy(
    function(username, password, done) {

    	//checks the database if there's an existing user
        User.findOne({ username: username }, function (err, user) {
            if(user !== null) {
                var isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if(isPasswordCorrect) {
                    console.log("Username and password correct!");
                    return done(null, user);
                } else {
                    console.log("Password incorrect!");
                    return done(null, false);
                }
           } else {
               console.log("Username does not exist!");
               return done(null, false);
           }
       });
    }
));

//serializing and deserializing for passport.authenticate
//Basically this function tells Passport how to get information from a User 
//object to be stored in a session.
passport.serializeUser(function(user, done) {
    done(null, user);
});

//how to take that information and turn it back into a User onject
passport.deserializeUser(function(user, done) {
    done(err, user);
});


//getting data from the Register page
app.post('/register', function (req, res, next) {

	//encrypting the password
	var password = bcrypt.hashSync(req.body.password);
	req.body.password = password;


	//User is the variable we created on the top
	//it represents the model
    User.create(req.body, function(err, saved) {
    if(err) {
        console.log(err);
        res.json({ message : err });
    } else {
        res.json({ message : "User successfully registered!"});
    }
});
});

app.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect('/');
});


app.listen(port, '0.0.0.0', function() {
 console.log('Server running at port ' + port);
});
