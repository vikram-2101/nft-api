// module.exports = (err, req, res, next) => {
//   //   console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       error: err,
//       stack: err.stack,
//     });
//   } else if (process.env.NODE_ENV === "production") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   }

//   next();
// };

//  PART 2---------------------

// const AppError = require("../Utils/appError");
// const handleCastError = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}`;
//   return new AppError(message, 400);
// };

// const handleDuplicationFieldsBD = (err) => {
//   // const value = err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/);
//   const value = Object.values(err.keyValue)[0];
//   console.log(value);
//   const message = `Duplicate field values ${value}. Please use another value`;
//   return new AppError(message, 400);
// };

// const sendErrorDev = (err, res) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//     error: err,
//     stack: err.stack,
//   });
// };

// const handleValidationError = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data. ${errors.join(". ")}`;
//   return new AppError(message, 400);
// };

// const sendErrorPro = (err, res) => {
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   } else {
//     res.status(500).json({
//       status: "error",
//       message: "Something went wrong",
//     });
//   }
// };
// module.exports = (err, req, res, next) => {
//   //   console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     sendErrorDev(err, res);
//   } else if (process.env.NODE_ENV === "production") {
//     let error = { ...err };
//     error.message = err.message; // Explicitly copy the message
//     error.name = err.name; // Explicitly copy the name

//     if (error.name === "CastError") error = handleCastError(error);
//     if (error.code === 11000) error = handleDuplicationFieldsBD(error);
//     if (error.name === "ValidationError") error = handleValidationError(error);
//     sendErrorPro(Error, res);
//   }

//   next();
// };

const AppError = require("../Utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicationFieldsBD = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: "${value}". Please use another value`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  // console.log(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  let environment = process.env.NODE_ENV;
  console.log(environment);

  if (environment == "development") {
    console.log("ahjscjdfakjl");

    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicationFieldsBD(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    sendErrorPro(error, res);
  }

  next();
};
