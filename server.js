const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const users = require('./routes/userRoutes');
const tasks = require('./routes/taskRoutes');

const PORT = 3001;

//Passport config
require('./config/passport')(passport);

app.use(cors());
app.use(bodyParser.json());

//Bodyparser
//this enables the app to use req.body
app.use(bodyParser.urlencoded( { extended: false } ));

//DB config
const db = require('./config/keys').MongoURI;

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect to Mongo
mongoose.connect(db, {useNewUrlParser: true})
  .then(()=>{
    console.log('MongoDB connected...');
  })
  .catch(err =>{
    console.log(err);
  });


//Routes
app.use('/users', users);
app.use('/users', tasks);

app.listen(PORT, () =>{
	console.log('Server is running on Port: ' + PORT);
});