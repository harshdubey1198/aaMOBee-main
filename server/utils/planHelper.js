// 🔹 Helper: Calculate expiration date for plan or offer (handles yearly/monthly/custom properly)
function getExpirationDate(plan, matchedOffer = null) {
  const expirationDate = new Date();
//   console.log("plan hai :",plan)
  console.log("matched offer :",matchedOffer)
  // ✅ 1. Offer-based days if explicitly provided
  if (matchedOffer?.days && matchedOffer.days > 0) {
    expirationDate.setDate(expirationDate.getDate() + matchedOffer.days);
    return expirationDate;
  }

  // ✅ 2. Use durationType + durationValue combo
  if (matchedOffer?.durationType) {
    const val = matchedOffer.durationValue || 1;
    console.log("❤️ value : ",val);
    if (matchedOffer.durationType === "yearly") {
      expirationDate.setFullYear(expirationDate.getFullYear() + val);
    } else if (matchedOffer.durationType === "monthly") {
      expirationDate.setMonth(expirationDate.getMonth() + val);
    } else if (matchedOffer.durationType === "custom") {
      expirationDate.setMonth(expirationDate.getMonth() + val);
    }

    return expirationDate;
  }

  // ✅ 3. Fallback for old schema with plan.days
  if (plan.days && plan.days > 0) {
    expirationDate.setDate(expirationDate.getDate() + plan.days);
    return expirationDate;
  }

  // ✅ 4. Default fallback 30 days
  expirationDate.setDate(expirationDate.getDate() + 30);
  return expirationDate;
}

module.exports = {
  getExpirationDate
};
