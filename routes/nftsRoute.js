const express = require("express");
const {
  getAllNFTs,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
  // checkId,
  // checkBody,
} = require("../controllers/nftController");
// const nftControllers = require('./../controllers/nftController')

const router = express.Router();

// router.param("id", checkId);

//ROUTER FOR NFTS
router.route("/").get(getAllNFTs).post(createNFT);

router.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

module.exports = router;
