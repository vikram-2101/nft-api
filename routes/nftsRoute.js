const express = require("express");
const {
  getAllNFTs,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
  aliasTopNFTs,
  getNFTsStats,
  getMonthlyPlan,
  // checkId,
  // checkBody,
} = require("../controllers/nftController");
const { login, protect } = require("../controllers/authController");
// const nftControllers = require('./../controllers/nftController')

const router = express.Router();

//TOP 5 NFTS BY PRICE
router.route("/top-5-nfts").get(aliasTopNFTs, getAllNFTs);

// STATS ROUTE
router.route("/nfts-stats").get(getNFTsStats);

//GET MONTHLY PLAN
router.route("/monthly-plan/:year").get(getMonthlyPlan);

//ROUTER FOR NFTS
router.route("/").get(protect, getAllNFTs).post(createNFT);

router.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

module.exports = router;
