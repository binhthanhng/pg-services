var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var app = express();

const v1 = require('./routes/v1');
const queuesRouter = require('./routes/admin');
//CORS
var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200, 
	//credentials: true,
	preflightContinue: false
};
app.options('*', cors(corsOptions));

// http CORS
app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended:true}));
app.use(cookieParser());
require('./db');
app.use('/api/v1', v1);
app.use('/admin/queues', queuesRouter);
//app.use('/', v1);
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found. Please use /v1/...' });
});

module.exports = app;
