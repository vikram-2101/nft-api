const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1 create a transporter
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "oscar73@ethereal.email",
      pass: "8w8HqS9XVphADD8q9v",
    },
  });
  //2 Define the email options
  const mailOptions = {
    from: "Vikram Kumar ",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3 Active send emalil
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
