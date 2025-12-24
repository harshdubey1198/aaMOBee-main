const express = require("express");
const { generateVectorStoreFromLocalPDFs } = require("../controllers/pdfEmbedController.js");

const router = express.Router();

router.get("/generate", generateVectorStoreFromLocalPDFs);

module.exports = router;
 