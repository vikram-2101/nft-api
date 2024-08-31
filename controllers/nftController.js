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

const NFT = require("../model/nftModel");

const getAllNFTs = async (req, res) => {
  try {
    const nfts = await NFT.find();
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      result: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    res.status(500).json({
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

module.exports = {
  getSingleNFT,
  getAllNFTs,
  createNFT,
  updateNFT,
  deleteNFT,
};