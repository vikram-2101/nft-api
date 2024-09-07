const User = require("../model/userModel");
const catchAsync = require("../Utils/catchAsync");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // send response
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    result: users.length,
    data: {
      users,
    },
  });
});
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Interval server error",
  });
};
const getSingleUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Interval server error",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Interval server error",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Interval server error",
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  createUser,
};
