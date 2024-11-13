const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err)=>{
  const value = err.keyValue ? err.keyValue.name : undefined;
  const message = `Dublicate field value: ${value}. please use another value`
  return new AppError(message,404)
}

const handleJWTError = () => new AppError('invalid token,please login again',401)
const handleExpiredJWT = () => new AppError('token has expired, please login again!',401)


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // operational,trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or other unknown errors
  } else {
    // log error
    console.error('Error', err);

    // send generic message
    res.status(500).json({
      status: 'error',
      message: 'something went wrong!',
    });

  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError' || err.kind === 'ObjectId'){
      error = handleCastErrorDB(error) ;
    }  else if (error.errors) {
      // Mongoose validation error
      const keys = Object.keys(error.errors);
      const message = error.errors[keys[0]].message;
      error = new AppError(message, 400);
    }
    if (err.code === 11000) error = handleDublicateFieldsDB(error);
    if(error.name === 'JsonWebTokenError') error = handleJWTError()
    if(error.name === 'TokenExpiredError') error = handleExpiredJWT()
    sendErrorProd(error, res);
  }
};
