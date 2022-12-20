var express = require("express");
var router = express.Router();
const uniqid = require("uniqid");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

router.post("/upload", async (req, res) => {
  const photoPath = `./tmp/${uniqid()}.jpg`;
  console.log(1);
  const resultMove = await req.files.photoFromFront.mv(photoPath);
  console.log(2);
  const resultCloudinary = await cloudinary.uploader.upload(photoPath);
  console.log(3);

  fs.unlinkSync(photoPath);

  if (!resultMove) {
    res.json({ result: true, url: resultCloudinary.secure_url });
  } else {
    res.json({ result: false, error: resultMove });
  }
});

module.exports = router;
