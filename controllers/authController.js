const User = require("../model/userModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const jwt = require("jsonwebtoken");

// CREATE TOKEN

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SIGN UP
const signup = catchAsync(async (req, res, next) => {
  try {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
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

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

module.exports = {
  signup,
  login,
};
