// // const fs = require("fs");

// // const nfts = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
// // );
// const NFT = require("../model/nftModel");

// // const checkId = (req, res, next, value) => {
// //   console.log(`ID: ${value}`);
// //   // if (req.params.id * 1 > nfts.length) {
// //   //   return res.status(404).json({
// //   //     status: "failure",
// //   //     message: "invalid ID",
// //   //   });
// //   // }
// //   next();
// // };

// // const checkBody = (req, res, next) => {
// //   if (!req.body.name || !req.body.price) {
// //     return res.status(404).json({
// //       status: "fail",
// //       message: "Missing name and price",
// //     });
// //   }
// //   next();
// // };

// const getAllNFTs = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     // result: nfts.length,
//     // data: {
//     //   nfts,
//     // },
//   });
// };

// // POST METHOD
// const createNFT = (req, res) => {
//   //   console.log(req.body);
//   // const newId = nfts[nfts.length - 1].id + 1;
//   // const newNFTs = Object.assign({ id: newId }, req.body);
//   // nfts.push(newNFTs);
//   // fs.writeFile(
//   //   `${__dirname}/nft-data/nft-simple.json`,
//   //   JSON.stringify(nfts),
//   //   (err) => {
//   //     res.status(201).json({
//   //       status: "success",
//   //       nfts: newNFTs,
//   //     });
//   //   }
//   // );
// };
// // GET SINGLE NFT
// const getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   // const nft = nfts.find((el) => el.id === id);

//   // if (!nft) {
//   //   return res.status(404).json({
//   //     status: "failure",
//   //     message: "invalid id",
//   //   });
//   // }

//   res.status(200).json({
//     status: "success",
//     // data: {
//     //   nft,
//     // },
//   });
// };
// // PATCH METHOD
// const updateNFT = (req, res) => {
//   // if (req.params.id * 1 > nfts.length) {
//   //   return res.status(404).json({
//   //     status: "failure",
//   //     message: "invalid ID",
//   //   });
//   // }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "updating nft",
//     },
//   });
// };
// // DELETE METHOD
// const deleteNFT = (req, res) => {
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// module.exports = {
//   getSingleNFT,
//   getAllNFTs,
//   createNFT,
//   updateNFT,
//   deleteNFT,
//   checkId,
//   checkBody,
// };

//// PART 2

// const NFT = require("../model/nftModel");
// // middleware for top 5 nfts
// const aliasTopNFTs = (req, res, next) => {
//   req.query.limit = "5";
//   req.query.sort = "-ratingsAverage,price";
//   req.query.fields = "name,price,ratingsAverage,difficulty";
//   next();
// };

// const getAllNFTs = async (req, res) => {
//   try {
//     // const nfts = await NFT.find();

//     // const nfts = await NFT.find()
//     //   .where("duration")
//     //   .equals(5)
//     //   .where("difficulty")
//     //   .equals("easy");

//     //build query
//     const queryObj = { ...req.query };
//     const excludeFields = ["page", "sort", "limit", "fields"];
//     excludeFields.forEach((el) => delete queryObj[el]);
//     // execute query

//     // console.log(req.query, queryObj);

//     //ADVANCE FILTERING QUERY
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     console.log(JSON.parse(queryStr));

//     let query = NFT.find(JSON.parse(queryStr));

//     // SORTING METHOD

//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       console.log(sortBy);
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort("-createdAt");
//     }

//     // FIELDS LIMITING
//     if (req.query.fields) {
//       const fields = req.query.fields.split(",").join(" ");
//       query = query.select(fields);
//     } else {
//       query = query.select("-__v");
//     }

//     // PAGINATION FUNCTION
//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 10;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     if (req.query.page) {
//       const newNFTs = await NFT.countDocuments();
//       if (skip >= newNFTs) {
//         throw new Error("This page doesn't exist");
//       }
//     }

//     const nfts = await query;

//     // send response
//     res.status(200).json({
//       status: "success",
//       requestTime: req.requestTime,
//       result: nfts.length,
//       data: {
//         nfts,
//       },
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// // POST METHOD
// const createNFT = async (req, res) => {
//   // const newNFT = new NFT({});
//   // newNFT.save();

//   try {
//     const newNFT = await NFT.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         nft: newNFT,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data send for NFT",
//     });
//   }
// };

// // GET SINGLE NFT
// const getSingleNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findById(req.params.id);
//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// // PATCH METHOD
// const updateNFT = async (req, res) => {
//   try {
//     const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: "success",
//       data: {
//         nft,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };
// // DELETE METHOD
// const deleteNFT = async (req, res) => {
//   try {
//     await NFT.findByIdAndDelete(req.params.id);
//     res.status(200).json({
//       status: "success",
//       data: null,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

// module.exports = {
//   aliasTopNFTs,
//   getSingleNFT,
//   getAllNFTs,
//   createNFT,
//   updateNFT,
//   deleteNFT,
// };

// PART 3 //

const NFT = require("../model/nftModel");
const APIFeatures = require("../Utils/apiFeatures");
// middleware for top 5 nfts
const aliasTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

// FORWARDED TO UTILS

// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }
//   filter() {
//     //build query
//     const queryObj = { ...this.queryString };
//     const excludeFields = ["page", "sort", "limit", "fields"];
//     excludeFields.forEach((el) => delete queryObj[el]);

//     //ADVANCE FILTERING QUERY
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     // this.query.find();

//     this.query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }
//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(",").join(" ");
//       console.log(sortBy);
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort("-createdAt");
//     }
//     return this;
//   }
//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join(" ");
//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select("-__v");
//     }
//     return this;
//   }
//   pagination() {
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 10;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);

//     // if (this.queryString.page) {
//     //   const newNFTs = NFT.countDocuments();
//     //   if (skip >= newNFTs) {
//     //     throw new Error("This page doesn't exist");
//     //   }
//     // }
//     return this;
//   }
// }

const getAllNFTs = async (req, res) => {
  try {
    // SORTING METHOD

    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   console.log(sortBy);
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }

    // FIELDS LIMITING
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    // PAGINATION FUNCTION
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const newNFTs = await NFT.countDocuments();
    //   if (skip >= newNFTs) {
    //     throw new Error("This page doesn't exist");
    //   }
    // }
    const features = new APIFeatures(NFT.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const nfts = await features.query;

    // send response
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      result: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// POST METHOD
const createNFT = async (req, res) => {
  // const newNFT = new NFT({});
  // newNFT.save();

  try {
    const newNFT = await NFT.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        nft: newNFT,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data send for NFT",
    });
  }
};

// GET SINGLE NFT
const getSingleNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
// PATCH METHOD
const updateNFT = async (req, res) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};
// DELETE METHOD
const deleteNFT = async (req, res) => {
  try {
    await NFT.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};

// Aggregate Pipeline

const getNFTsStats = async (req, res) => {
  try {
    const stats = await NFT.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          num: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgRating: 1 },
      },
      {
        $match: {
          _id: { $ne: "EASY" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// CALCULATING NUMBER OF NFT CREATE IN THE MONTH OR MONTHLY PLAN
const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await NFT.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numNFTStarts: { $sum: 1 },
          nfts: { $push: "$name" },
        },
      },
      {
        $addFields: {
          month: "$_id",
        },
      },
      {
        // hide the id
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          numNFTStarts: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

module.exports = {
  aliasTopNFTs,
  getSingleNFT,
  getAllNFTs,
  createNFT,
  updateNFT,
  deleteNFT,
  getNFTsStats,
  getMonthlyPlan,
};
