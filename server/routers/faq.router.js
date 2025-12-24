const express = require("express");
const router = express.Router();
const FAQController = require("../controllers/faq.contoller");
const { upload } = require("../utils/multer");

router.post("/create-faq", upload, FAQController.createFAQ);
router.get("/trending-faqs", FAQController.getTrendingFaqs);
router.get("/all-faqs", FAQController.getAllFAQs);
router.get("/top", FAQController.getTopFAQs);
router.get("/search", FAQController.searchFAQs);
router.get("/:slug", FAQController.getFAQBySlug);
router.put("/:slug",upload, FAQController.updateFAQ);
router.delete("/:slug", FAQController.deleteFAQ);
router.patch("/:slug/increment-view", FAQController.incrementView);


module.exports = router;
