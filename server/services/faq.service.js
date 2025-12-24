const FAQ = require("../schemas/faq.schema");
const slugify = require("slugify");

const FAQService = {};

const createCustomSlug = (question) => {
  const initialChars = (question || "faq").substring(0, 20);
  const slugifiedPart = slugify(initialChars, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
  const timestamp = Date.now();
  return `${slugifiedPart}-${timestamp}`;
};

// ✅ Create FAQ
FAQService.createFAQ = async (body) => {
  const { question, answer, category, media, createdBy, priority, navigateTo } = body;
  const slug = createCustomSlug(question);

  const faq = await FAQ.create({
    question,
    answer,
    category,
    media,
    slug,
    createdBy,
    priority,
   navigateTo,
  });

  return faq;
};

// ✅ Get all FAQs (exclude soft deleted)
FAQService.getAllFAQs = async () => {
  return await FAQ.find({ deletedAt: null }).sort({ createdAt: -1 });
};

// ✅ Get single FAQ
FAQService.getFAQBySlug = async (slug) => {
  const faq = await FAQ.findOne({ slug, deletedAt: null });
  if (!faq) throw new Error("FAQ not found.");
  return faq;
};

// ✅ Update FAQ
FAQService.updateFAQ = async (slug, body) => {
let updateData = {
  ...body,
  navigateTo: body.navigateTo || "", // ✅ ensure it updates or resets cleanly
};
  if (body.question) {
    updateData.slug = createCustomSlug(body.question);
  }

  const faq = await FAQ.findOneAndUpdate({ slug, deletedAt: null }, updateData, {
    new: true,
    runValidators: true,
  });

  if (!faq) throw new Error("FAQ not found.");
  return faq;
};

// ✅ Soft Delete FAQ
FAQService.deleteFAQ = async (slug) => {
  const faq = await FAQ.findOneAndUpdate(
    { slug, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );
  if (!faq) throw new Error("FAQ not found or already deleted.");
  return faq;
};

// ✅ Get Top 5 FAQs (lowest priority = top)
FAQService.getTopFAQs = async () => {
  return await FAQ.find({ deletedAt: null })
    .sort({ priority: 1, createdAt: -1 })
    .limit(5);
};

FAQService.incrementView = async (slug, ipAddress) => {
  const faq = await FAQ.findOne({ slug, deletedAt: null });
  if (!faq) throw new Error("FAQ not found");

  // ✅ Only increment if IP is not already recorded
  if (!faq.viewedIPs.includes(ipAddress)) {
    faq.views = (faq.views || 0) + 1;
    faq.viewedIPs.push(ipAddress);

    // Ensure Mongoose recognizes array change
    faq.markModified("viewedIPs");

    await faq.save();
    console.log(`✅ View incremented for slug: ${slug}, IP: ${ipAddress}`);
  } else {
    console.log(`ℹ️ Skipped increment — IP ${ipAddress} already viewed`);
  }

  return faq;
};


// ✅ Get top 5 trending FAQs by view count
FAQService.getTrendingFaqs = async () => {
  const faqs = await FAQ.find({ deletedAt: null })
    .sort({ views: -1 }) // sort descending by views
    .limit(5);
  return faqs;
};

// ✅ Search FAQs by question (fuzzy)
FAQService.searchFAQs = async (term) => {
  return FAQ.find({
    deletedAt: null,
    question: { $regex: term, $options: "i" }, // case-insensitive search
  }).limit(10);
};


module.exports = FAQService;
