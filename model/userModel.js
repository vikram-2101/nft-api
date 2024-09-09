const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // THIS will only work on save not on find, findone
        validator: function (el) {
          return el === this.password; // true or false
        },
        message: "password do not match",
      },
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // PASSWORD MODIFIED
  if (!this.isModified("password")) return next();
  // HASH PASSWORD
  this.password = await bcrypt.hash(this.password, 12);
  // DELETE CONFIRM PASSWORD
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimestamp);
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
