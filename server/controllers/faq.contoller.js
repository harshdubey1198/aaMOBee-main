const FAQService = require("../services/faq.service");
const uploadToCloudinary = require("../utils/cloudinary");
const FAQ = require("../schemas/faq.schema");

exports.createFAQ = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    let media = [];

    // 🆕 handle faqMedia files
    if (req.files && req.files.faqMedia) {
      media = await Promise.all(
        req.files.faqMedia.map(async (file) => {
          const resourceType = file.mimetype.startsWith("video") ? "video" : "image";
          const url = await new Promise((resolve, reject) => {
            const stream = require("cloudinary").v2.uploader.upload_stream(
              { resource_type: resourceType, folder: "aamobee_faqs" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          });
          return { type: resourceType, url };
        })
      );
    }

    // ✅ Parse category & existingMedia (because they come as stringified JSON)
    let parsedCategory = [];
    let parsedExistingMedia = [];

    try {
      if (req.body.category) {
        parsedCategory = JSON.parse(req.body.category);
      }
    } catch (err) {
      console.warn("Invalid category JSON:", req.body.category);
    }

    try {
      if (req.body.existingMedia) {
        parsedExistingMedia = JSON.parse(req.body.existingMedia);
      }
    } catch (err) {
      console.warn("Invalid existingMedia JSON:", req.body.existingMedia);
    }

    // ✅ Merge parsed + uploaded media
    const payload = {
      ...req.body,
      category: parsedCategory,
      media: [...parsedExistingMedia, ...media],
    };

    const result = await FAQService.createFAQ(payload);


    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get All FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const result = await FAQService.getAllFAQs();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get FAQ by Slug
exports.getFAQBySlug = async (req, res) => {
  try {
    const result = await FAQService.getFAQBySlug(req.params.slug);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Update FAQ (with support for media deletion)
exports.updateFAQ = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1) Get existing FAQ
    const existing = await FAQ.findOne({ slug, deletedAt: null });
    if (!existing) {
      return res.status(404).json({ success: false, message: "FAQ not found." });
    }

    // 2) Upload new files (Cloudinary)
    let uploadedMedia = [];
    if (req.files && req.files.faqMedia && req.files.faqMedia.length > 0) {
      uploadedMedia = await Promise.all(
        req.files.faqMedia.map(async (file) => {
          const resourceType = file.mimetype.startsWith("video") ? "video" : "image";
          const url = await uploadToCloudinary(file.buffer, resourceType, "aamobee_faqs");
          return { type: resourceType, url };
        })
      );
    }

    // 3) 🆕 Merge or remove media according to frontend state
    let updatedMedia = [];
    if (req.body.existingMedia) {
      try {
        const parsed = JSON.parse(req.body.existingMedia);
        updatedMedia = parsed
          .filter((m) => m && (m.url || m.startsWith("http")))
          .map((m) => (typeof m === "string" ? { url: m, type: "image" } : m));
      } catch (err) {
        console.warn("Invalid existingMedia JSON:", req.body.existingMedia);
      }
    }

    if (uploadedMedia.length > 0) {
      updatedMedia = [...updatedMedia, ...uploadedMedia];
    }

    const updateBody = {
      ...req.body,
      media: updatedMedia,
    };

    const result = await FAQService.updateFAQ(slug, updateBody);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Update FAQ error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};


// ✅ Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    await FAQService.deleteFAQ(req.params.slug);
    res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Get Top 5 FAQs
exports.getTopFAQs = async (req, res) => {
  try {
    const result = await FAQService.getTopFAQs();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.incrementView = async (req, res) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "unknown";

    console.log("📡 IP detected:", ipAddress);

    const updatedFaq = await FAQService.incrementView(req.params.slug, ipAddress);

    res.status(200).json({ success: true, data: updatedFaq });
  } catch (error) {
    console.error("❌ Error incrementing FAQ view:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

// ✅ Controller: Get top 5 trending FAQs
exports.getTrendingFaqs = async (req, res) => {
  try {
    const trendingFaqs = await FAQService.getTrendingFaqs();
    res.status(200).json({ success: true, data: trendingFaqs });
  } catch (error) {
    console.error("Error fetching trending FAQs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch trending FAQs." });
  }
};


// ✅ Search FAQs
exports.searchFAQs = async (req, res) => {
  try {
    const term = req.query.q || "";
    const results = await FAQService.searchFAQs(term);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

