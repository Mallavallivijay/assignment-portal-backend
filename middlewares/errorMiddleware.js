// not implement here
  //  if (err.name === "JsonWebTokenError") {
  //   const message = `Json web token is invalid, try again`;
  //   error = new ErrorHandler(message, 400);
  // }
const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
//for logout - notimplement and use on frontend side
  // if (err.name === "jwtExpiredError") {
  //   const message = `Json web token is expired, please login again`;
  //   error = new ErrorHandler(message, 400);
  // }
  

module.exports = { errorHandler };
