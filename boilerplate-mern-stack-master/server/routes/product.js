const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일 저장 공간
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`); // 저장 시 이
  },
});

const upload = multer({ storage: storage }).single("file"); // 가져온 이미지

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장해주면 됨.
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path, // 파일 저장 경로
      fileName: res.req.file.filename, // 파일 이름
    });
  });
});

router.post("/", (req, res) => {
  // 받아온 정보들을 DB에 넣어 준다.
  const product = new Product(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  // product collection에 들어 있는 모든 상품 정보를 가져오기

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  Product.find()
    .populate("writer") // 이 사람에 대한 모든 정보 가져오기
    .skip(skip)
    .limit(limit)
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false });
      return res.status(200).json({ success: true, productInfo,
                                    postSize:productInfo.length});
    });
});

module.exports = router;
