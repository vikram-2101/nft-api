const fs = require("fs");

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

const checkId = (req, res, next, value) => {
  console.log(`ID: ${value}`);
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "failure",
      message: "invalid ID",
    });
  }
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      status: "fail",
      message: "Missing name and price",
    });
  }
  next();
};

const getAllNFTs = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    length: nfts.length,
    data: {
      nfts,
    },
  });
};

// POST METHOD
const createNFT = (req, res) => {
  //   console.log(req.body);
  const newId = nfts[nfts.length - 1].id + 1;
  const newNFTs = Object.assign({ id: newId }, req.body);

  nfts.push(newNFTs);

  fs.writeFile(
    `${__dirname}/nft-data/nft-simple.json`,
    JSON.stringify(nfts),
    (err) => {
      res.status(201).json({
        status: "success",
        nfts: newNFTs,
      });
    }
  );
};
// GET SINGLE NFT
const getSingleNFT = (req, res) => {
  const id = req.params.id * 1;
  const nft = nfts.find((el) => el.id === id);

  if (!nft) {
    return res.status(404).json({
      status: "failure",
      message: "invalid id",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
};
// PATCH METHOD
const updateNFT = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nft: "updating nft",
    },
  });
};
// DELETE METHOD
const deleteNFT = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getSingleNFT,
  getAllNFTs,
  createNFT,
  updateNFT,
  deleteNFT,
  checkId,
  checkBody,
};
