const User = require("../model/userModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../Utils/email");
const crypto = require("crypto");
// CREATE TOKEN

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(newUser._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// SIGN UP
const signup = catchAsync(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    // const newUser = await User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    //   passwordConfirm: req.body.passwordConfirm,
    // });

    // console.log(newUser);
    // createSendToken(newUser, 201, res);
    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    return next(error, 401);
  }
});

// LOGIN USER
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("check email and password");
    return next(new AppError("Please provide your email and password."));
  }

  const user = await User.findOne({ email }).select("+password");
  // console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email and password", 401));
  }
  // createSendToken(user, 200, res);
  const token = signToken(user.id);
  // console.log(token);
  res.status(200).json({
    status: "success",
    token,
  });
});

// PROTECTING DATA

const protect = catchAsync(async (req, res, next) => {
  // 1 check token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in to get access", 401));
  }
  // 2 validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  // console.log(decoded);
  // 3 user exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The User belonging to this token no longer exist.", 401)
    );
  }
  // 4 change password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed the password", 401));
  }
  // USER WILL HAVE ACCESS THE PROTECTED DATA
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("you have not access to delete nft", 403));
    }
    next();
  };
};

// NOW WE ARE GOING TO WORK ON
//-- FORGOT PASSWORD
const forgotPassword = catchAsync(async (req, res, next) => {
  //1. get the user based on the given email
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      return next(new AppError("There is no user with this email", 404));
    }
    //2 create a random token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //3 send email back to user
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forget your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}.\n If didn't forget your password, please ignore this email. `;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email, Try Again later", 500)
    );
  }
});
//RESET PASSWORD

const resetPassword = async (req, res, next) => {
  //1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now },
  });
  // 2 if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  // 3 Update changed Password for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 4 Log the user in , send jwt
  // createSendToken(user, 200, res);

  const token = signToken(user.id);
  // console.log(token);
  res.status(200).json({
    status: "success",
    token,
  });
};

// UPDATING PASSWORD

const updatePassword = catchAsync(async (req, res, next) => {
  // 1 Get User from collection of data
  const user = await user.findById(req.user.id).select("+password");
  // 2 Check if the user's Current Password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  //3 if so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  //4 Log user after the password change
});

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
