var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

var manufacturerRouter = require('./routes/manufacturers');
var vaccineRouter = require('./routes/vaccines');
// var adminRouter = require('./routes/admin');
dotenv.config();

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
const PORT = 3000;

app.use('/manufacturers', manufacturerRouter);
app.use('/vaccines', vaccineRouter);
// app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("ERROR: We can't find the page you are looking for");
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
});

module.exports = app;