const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then((con) => {
  // console.log(con.connection);
  console.log("DB Connnected Successfully");
});

// const testNFT = new NFT({
//   name: "The crazy monkey",
//   rating: 3.2,
//   price: 345,
// });

// testNFT
//   .save()
//   .then((docNFT) => {
//     console.log(docNFT);
//   })
//   .catch((error) => {
//     console.log("Error", error);
//   });

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
