const express = require("express");
const { chatFromVectorStore } = require("../controllers/chatController.js");

const router = express.Router();

router.post("/ask", chatFromVectorStore);

module.exports = router;
