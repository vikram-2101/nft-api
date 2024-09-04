// const express = require("express");
// const fs = require("fs");
// const morgan = require("morgan");

// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// // CUSTOM MIDDLEWARE

// app.use((req, res, next) => {
//   console.log("Hey i am middleware function");
//   next();
// });

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// const nfts = JSON.parse(
//   fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
// );

// const getAllNFTs = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     length: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// };

// // POST METHOD
// const createNFT = (req, res) => {
//   //   console.log(req.body);
//   const newId = nfts[nfts.length - 1].id + 1;
//   const newNFTs = Object.assign({ id: newId }, req.body);

//   nfts.push(newNFTs);

//   fs.writeFile(
//     `${__dirname}/nft-data/nft-simple.json`,
//     JSON.stringify(nfts),
//     (err) => {
//       res.status(201).json({
//         status: "success",
//         nfts: newNFTs,
//       });
//     }
//   );
// };
// // GET SINGLE NFT
// const getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   const nft = nfts.find((el) => el.id === id);

//   if (!nft) {
//     return res.status(404).json({
//       status: "failure",
//       message: "invalid id",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft,
//     },
//   });
// };
// // PATCH METHOD
// const updateNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "failure",
//       message: "invalid ID",
//     });
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "updating nft",
//     },
//   });
// };
// // DELETE METHOD
// const deleteNFT = (req, res) => {
//   if (req.params.id * 1 > nfts.length) {
//     return res.status(404).json({
//       status: "failure",
//       message: "invalid ID",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// // --------------USERS

// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Interval server error",
//   });
// };
// const createUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Interval server error",
//   });
// };
// const getSingleUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Interval server error",
//   });
// };
// const updateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Interval server error",
//   });
// };
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Interval server error",
//   });
// };

// const nftsRouter = express.Router();
// const usersRouter = express.Router();

// //ROUTER FOR NFTS
// nftsRouter.route("/").get(getAllNFTs).post(createNFT);

// nftsRouter.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

// // ROUTER FOR USERS

// usersRouter.route("/").get(getAllUsers).post(createUser);

// usersRouter
//   .route("/:id")
//   .get(getSingleUser)
//   .patch(updateUser)
//   .delete(deleteUser);

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// // PART 2

// const express = require("express");
// const morgan = require("morgan");

// const nftsRouter = require("./routes/nftsRoute");
// const usersRouter = require("./routes/usersRoute");

// const app = express();
// app.use(express.json());
// app.use(morgan("dev"));

// // if (process.env.NODE_ENV === "development") {
// //   app.use(morgan("dev"));
// // }

// // SERVING TEMPLATE DEMO
// app.use(express.static(`${__dirname}/nft-data/img`));

// // CUSTOM MIDDLEWARE

// // app.use((req, res, next) => {
// //   console.log("Hey i am middleware function");
// //   next();
// // });

// // app.use((req, res, next) => {
// //   req.requestTime = new Date().toISOString();
// //   next();
// // });

// app.use("/api/v1/nfts", nftsRouter);
// app.use("/api/v1/users", usersRouter);

// module.exports = app;

// PART 3 ERROR HANDLING
const express = require("express");
const morgan = require("morgan");

const nftsRouter = require("./routes/nftsRoute");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

/// ERROR SECTION
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// GLOBAL ERROR HANDLER
module.exports = app;
