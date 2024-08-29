const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

// CUSTOM MIDDLEWARE

app.use((req, res, next) => {
  console.log("Hey i am middleware function");
  next();
});

const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/nft-data/data/nft-simple.json`)
);

const getAllNFTs = (req, res) => {
  res.status(200).json({
    status: "success",
    results: nfts.length,
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
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "failure",
      message: "invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      nft: "updating nft",
    },
  });
};
// DELETE METHOD
const deleteNFT = (req, res) => {
  if (req.params.id * 1 > nfts.length) {
    return res.status(404).json({
      status: "failure",
      message: "invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

// app.get("/api/v1/nfts", getAllNFTs);
// app.post("/api/v1/nfts", createNFT);
// app.get("/api/v1/nfts/:id", getSingleNFT);
// app.patch("/api/v1/nfts/:id", updateNFT);
// app.delete("/api/v1/nfts/:id", deleteNFT);

app.route("/api/v1/nfts").get(getAllNFTs).post(createNFT);
app
  .route("/api/v1/nfts/:id")
  .get(getSingleNFT)
  .patch(updateNFT)
  .delete(deleteNFT);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
