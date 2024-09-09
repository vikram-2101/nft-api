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

    console.log(newUser);

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

  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
    user,
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
  // 3 user exist
  // 4 change password
  next();
});

module.exports = {
  signup,
  login,
  protect,
};
