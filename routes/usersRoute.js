const express = require("express");
const {
  getAllUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const { signup } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);

// ROUTER USERS
router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

module.exports = router;
