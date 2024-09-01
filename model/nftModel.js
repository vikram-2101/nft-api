const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "must provide duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "must have difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have price"],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide the summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "must provide the cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // to hide while query
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// does not get stored in database but shows at the time of execution
nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
