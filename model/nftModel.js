const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "nft must have a maximum length of 40 character"],
      minlength: [10, "nft must have a minimum length of 10 character"],
      // validate: [validator.isAlpha, "NFT name must only contain Characters"],
    },
    slug: String,
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
      enum: {
        values: ["easy", "medium", "difficulty"],
        message: "Difficuly is either: easy, medium and difficulty",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "must have 1"],
      max: [5, "must have 5"],
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
      // THIS WILL ONLY WORK AT THE TIME OF CREATE NOT UPDATE
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // 200 > 100 20 < 100
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
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
    secretNFTs: {
      type: Boolean,
      default: false,
    },
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

// MONGOOSE MIDDLEWARE:

// DOCUMENT MIDDLEWARE: runs before .save() or .create()
// pre hook document
nftSchema.pre("save", function (next) {
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// nftSchema.pre("save", function (next) {
//   console.log("document will save..");
//   next();
// });

// nftSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

// -- PRE
// nftSchema.pre("find", function (next) {
//   this.find({ secretNFTs: { $ne: true } });
//   next();
// });
// nftSchema.pre("findOne", function (next) {
//   this.find({ secretNFTs: { $ne: true } });
//   next();
// });

// FOR SECRET NFTS
nftSchema.pre(/^find/, function (next) {
  this.find({ secretNFTs: { $ne: true } });
  this.start = Date.now();
  next();
});

// --POST

nftSchema.post(/^find/, function (doc, next) {
  console.log(`Query took time: ${Date.now() - this.start} times`);
  // console.log(doc);
  next();
});

// AGGREGATE MIDDLEWARE
nftSchema.pre("aggregate", function (next) {
  // console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretNFTs: { $ne: true } } });
  next();
});
const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
