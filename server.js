// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const app = require("./app");
// dotenv.config({ path: "./config.env" });

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// mongoose.connect(DB).then((con) => {
//   // console.log(con.connection);
//   console.log("DB Connnected Successfully");
// });
// // const testNFT = new NFT({
// //   name: "The crazy monkey",
// //   rating: 3.2,
// //   price: 345,
// // });

// // testNFT
// //   .save()
// //   .then((docNFT) => {
// //     console.log(docNFT);
// //   })
// //   .catch((error) => {
// //     console.log("Error", error);
// //   });

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// this is a change

// PART 2 ----------
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((con) => {
    console.log("DB Connnected Successfully");
  })
  .catch((err) => console.log("Error"));

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UnhandledRejection Shutting down application");
  server.close(() => {
    process.exit(1);
  });
});
