let paymentService = {}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");
const Payment = require('../schemas/payment.schema');
const Plan = require('../schemas/plans.schema');
const User = require('../schemas/user.schema');
const { default: axios } = require('axios');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { getExpirationDate } = require('../utils/planHelper');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
const { sendPlanExpiryReminder } = require('../utils/mailer');

paymentService.createPayment = async (body) => {
    try {
        const {userId, amount, planId} = body
        const user = await User.findOne({_id: userId})
        if(!user){
            return Promise.reject({messages: "You are not register to buy this plan"})
        }

        if(user.planId && user.planId.toString() === planId){
            return Promise.reject({message: "You have already Purchased this Plan"})
        }

        const payment = new Payment({
            userId: user._id,
            amount: amount,
            planId: planId,
            status: "pending"
        })

        // add payment gateway later to this for updating the status
        payment.status = "completed",
        await payment.save()

        if(payment.status === "completed"){
            user.planId = planId
            await user.save()
        }

        return payment
    } catch (error) {
        console.error(error);
        return Promise.reject('Error creating payments for plans.');
    }
}

paymentService.createCheckoutSession = async (body) => {
  try {
    const { email, planId, currency, amount } = body; 
    // console.log("📩 Incoming Body:", body);

    // 1️⃣ Find user
    const user = await User.findOne({ email: email.trim() });
    // console.log("👤 User Lookup Result:", user?._id || "User not found");
    if (!user) throw new Error("User not found");

    // 2️⃣ Find plan
    const plan = await Plan.findById(planId);
    // console.log("📦 Plan Lookup Result:", plan ? plan.title : "Plan not found");
    if (!plan) throw new Error("Invalid Plan ID");

    // 3️⃣ Normalize currency
    let currencyCode = (typeof currency === "string" ? currency : currency || "INR")
      .toString()
      .trim()
      .toUpperCase();
    // console.log("💱 Normalized Currency Code:", currencyCode);

    // 4️⃣ Find price details
    const priceForCurrency = plan.prices.find(
      (p) => p.currency.toString().trim().toUpperCase() === currencyCode
    );
    // console.log("💰 Price for Currency:", priceForCurrency || "Not Found");
    if (!priceForCurrency) throw new Error("Currency not supported for this plan");

    // 5️⃣ Match offer by amount
    let matchedOffer = priceForCurrency.offers.find(
      (offer) => offer.discountedPrice === amount
    );
    // console.log("🎯 Matched Offer:", matchedOffer || "Not Found");

    if (!matchedOffer && priceForCurrency.basePrice === amount) {
      matchedOffer = { days: 30 }; // fallback
      // console.log("⚡ Using Base Price Fallback:", matchedOffer);
    }

    if (!matchedOffer) throw new Error("No matching offer for given amount");

    // 6️⃣ Expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + matchedOffer.days);
    // console.log("📆 Expiration Date:", expirationDate.toISOString());

    // 7️⃣ Stripe amount
    let finalAmount = amount  * 100 ;
    // console.log("💵 Final Amount for Stripe:", finalAmount);

    // 8️⃣ Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: currencyCode.toLowerCase(),
            product_data: { name: plan.title, description: plan.caption },
            unit_amount: Math.round(finalAmount),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-failure`,
      metadata: {
        userId: user._id.toString(),
        planId,
        offerId: matchedOffer?._id?.toString() || null,
        expirationDate: expirationDate.toISOString(),
      },
    });
    // console.log("✅ Stripe Session Created:", session.url);

    // 9️⃣ Save Payment
    await Payment.create({
      userId: user._id,
      planId: plan._id,
      amount,
      currency: currencyCode,
      status: "pending",
      offerId: matchedOffer?._id?.toString() || null,
      expirationDate,
    });
    // console.log("✅ Payment Record Saved");

    return { checkoutUrl: session.url };

  } catch (error) {
    console.error("❌ Error in createCheckoutSession:", error.message);
    throw error; // forward exact error
  }
};


async function convertCurrency(amount, fromCurrency, toCurrency) {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();
    console.log(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);

    if (fromCurrency.toLowerCase() === toCurrency.toLowerCase()) return amount; 

    try {
        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const rate = response.data.rates[toCurrency];

        if (!rate) {
            console.error(`Exchange rate for ${toCurrency} not found.`);
            return amount; // Fallback to the original amount instead of NaN
        }

        return Math.round(amount * rate);
    } catch (error) {
        console.error("Currency conversion failed:", error);
        return amount; // Fallback to the original amount
    }
}




//Verify Payment Using Session ID
paymentService.verifyPayment = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new Error("Invalid session ID");

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    const { userId, planId } = session.metadata;
    let user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Plan not found");

    // ✅ Actual paid amount
    const paidAmount = session.amount_total / 100;
    const currencyCode = session.currency.toUpperCase();

    // ✅ Find price config for this currency
    const priceForCurrency = plan.prices.find(
      (p) => p.currency.toUpperCase() === currencyCode
    );
    if (!priceForCurrency) throw new Error("Currency not supported for this plan");

    // ✅ Match against offers
    let matchedOffer = priceForCurrency.offers.find(
      (offer) => offer.discountedPrice === paidAmount
    );

    // fallback to basePrice
    if (!matchedOffer && priceForCurrency.basePrice === paidAmount) {
      matchedOffer = { days: 30 };
    }
    if (!matchedOffer) throw new Error("No matching offer found for this amount");

    // ✅ Expiration date from offer.days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + matchedOffer.days);

    // ✅ Update or create payment record
    await Payment.findOneAndUpdate(
      { userId, planId, status: "pending" },
      {
        status: "completed",
        amount: paidAmount,
        currency: session.currency,
        expirationDate,
        paymentId: session.id,
      }
    );

    user.isActive = true;
    user.planId = plan._id;
    await user.save();

    return {
      status: session.payment_status,
      amount: paidAmount,
      currency: session.currency,
      customer_email: session.customer_email,
      message: "Payment verified and user activated",
    };
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw new Error("Payment verification failed");
  }
};


// paymentService.verifyPayment = async (sessionId) => {
//     try {
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         if (!session) throw new Error("Invalid session ID");

//         return {
//             status: session.payment_status,
//             amount: session.amount_total / 100,
//             currency: session.currency,
//             customer_email: session.customer_email,
//         };
//     } catch (error) {
//         console.error("Error verifying payment:", error);
//         throw new Error("Payment verification failed");
//     }
// };


paymentService.getPayment = async (filters) => {
    try {
        const payments = await Payment.find(filters).populate('userId').populate('planId');
        return {
            count: payments.length,
            data: payments,
            message: 'Payments fetched successfully'
        };
    } catch (error) {
        console.error("Error fetching payments:", error.message || error);
        throw new Error("Unable to Fetch Payments");
    }
};


paymentService.updatePayment = async (paymentId, updateData) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(paymentId, updateData, { new: true });
        return updatedPayment;
    } catch (error) {
        console.error("Error updating payment:", error.message || error);
        throw new Error("Unable to update payment");
    }
};


paymentService.deletePayment = async (paymentId) => {
    try {
        const result = await Payment.findByIdAndDelete(paymentId);
        return result;
    } catch (error) {
        console.error("Error deleting payment:", error.message || error);
        throw new Error("Unable to delete payment");
    }
};

paymentService.getAllPayments = async () => {
    try {
    const payments = await Payment.find().sort({ paymentDate: 1 }); 

    if (!payments || payments.length === 0) {
        throw new Error("No payments found.")
    }
    let userPayments = {};
    payments.forEach(payment => {
        const userId = payment.userId.toString();
        if (!userPayments[userId]) {
            userPayments[userId] = {
                userId,
                totalPayments: 0,
                currentPlan: payment.plan, 
                payments: []
            };
        }

        userPayments[userId].totalPayments += 1;
        userPayments[userId].payments.push(payment);
        userPayments[userId].currentPlan = payment.plan;
    });

    const paymentSummary = Object.values(userPayments);

    return paymentSummary;
} catch (error) {
    console.error("Error fetching all payments:", error.message || error);
    throw new Error("Unable to fetch payment details.")

}
}


paymentService.getUserPayments = async (userId) => {
    try {
        const payments = await Payment.find({ userId })
            .sort({ dateFrom: -1 })
            .populate('planId', "title price days")
            .select("amount currency paymentDate expirationDate paymentDate status")

        if (!payments.length) {
            throw new Error("No payment history found" );
        }

        return payments;
    } catch (error) {
        throw new Error("Error fetching payment history");
    }
}
paymentService.createFreePlanPayment = async ({ userId, planId }) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Plan not found");

    // // Check if user already has this plan
    // if (user.planId && user.planId.toString() === planId.toString()) {
    //   throw new Error("You have already purchased this plan.");
    // }

    // Set expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + plan.days);

    // Create a free payment record
    const payment = await Payment.create({
      userId: user._id,
      planId: plan._id,
      amount: 0,
      status: "completed",
      currency: "INR",
      expirationDate
    });

    // Activate the plan for user
    user.planId = plan._id;
    user.isActive = true;
    await user.save();

    return {
      message: "Free plan activated successfully",
      plan: plan.title,
      userId: user._id,
      expirationDate
    };
  } catch (error) {
    console.error("Error creating free plan payment:", error.message || error);
    throw new Error("Unable to process free plan activation.");
  }
};


/**
 * Create Razorpay Order
 * body: { email, planId, currency? }
 */
/**
 * Create Razorpay Order
 */
paymentService.createRazorpayOrder = async (body) => {
  try {
    const { email, planId, currency, amount } = body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const plan = await Plan.findById(planId);
    if (!plan) throw new Error("Invalid Plan ID");

    const currencyCode = (currency?.code || currency || "INR").toUpperCase();

    // ✅ Use explicit check to allow 0
    const finalAmount =
      typeof amount === "number" && amount >= 0 ? amount : plan.price;

    // ✅ Handle 0-amount case separately (no Razorpay order)
      if (finalAmount === 0) {
        // console.log("🟢 0-amount plan detected. Skipping Razorpay order creation.");

        // 🔹 Find price & offer match (optional but precise)
        const priceForCurrency = plan.prices.find(
          (p) => p.currency.toUpperCase() === currencyCode
        );

        let matchedOffer = null;
        if (priceForCurrency) {
          matchedOffer = priceForCurrency.offers.find(
            (offer) => offer.discountedPrice === 0
          ) || priceForCurrency.offers[0];
        }

        // 🔹 Compute expiration date smartly
        const expirationDate = getExpirationDate(plan, matchedOffer);

        // 🔹 Save payment record
        const payment = await Payment.create({
          userId: user._id,
          planId: plan._id,
          amount: 0,
          currency: currencyCode,
          status: "completed",
          orderId: null,
          paymentId: "FREE_PLAN_" + Date.now(),
          expirationDate,
          notes: { autoApproved: true },
        });

        // 🔹 Auto-upgrade user plan
        user.planId = plan._id;
        user.isActive = true;
        await user.save();

        return {
          message: "Free plan activated successfully.",
          paymentId: payment.paymentId,
          planTitle: plan.title,
          amount: 0,
          currency: currencyCode,
          status: "completed",
          expirationDate,
        };
      }



    // ✅ Proceed with normal paid case
    const options = {
      amount: Math.round(finalAmount * 100), // smallest currency unit
      currency: currencyCode,
      receipt: `receipt_${Date.now()}`,
      notes: { userId: user._id.toString(), planId: plan._id.toString() },
    };

    const order = await razorpay.orders.create(options);

    // Save initial payment record
    await Payment.create({
      userId: user._id,
      planId: plan._id,
      amount: finalAmount,
      currency: currencyCode,
      status: "pending",
      orderId: order.id,
    });

    return {
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      name: plan.title,
      description: plan.caption || "",
      userEmail: user.email,
    };
  } catch (error) {
    console.error("createRazorpayOrder error:", error);
    throw new Error("Could not create Razorpay order");
  }
};


/**
 * Verify Razorpay payment after success
 */
paymentService.verifyRazorpayPayment = async (body) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment details");
    }

    // ✅ Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const expectedSignature = hmac.digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // ✅ Fetch order + metadata
    const orderData = await razorpay.orders.fetch(razorpay_order_id);
    const userId = orderData.notes?.userId;
    const planId = orderData.notes?.planId;
    if (!userId || !planId) throw new Error("Order missing metadata");

    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);
    if (!user || !plan) throw new Error("Invalid user or plan");

    // ✅ Actual paid amount (not paise, INR)
    const paidAmount = orderData.amount / 100;

    // ✅ Currency normalization
    const currencyCode = orderData.currency.toUpperCase();
    const currencyMap = { "₹": "INR", "$": "USD", "£": "GBP", "AED": "AED", "SAR": "SAR", "RM": "MYR", "Rp": "IDR" };

    const priceForCurrency = plan.prices.find(
      (p) => (currencyMap[p.currency] || p.currency.toUpperCase()) === currencyCode
    );

    if (!priceForCurrency) throw new Error("Currency not supported for this plan");

    // ✅ Match offer by discountedPrice
    let matchedOffer = priceForCurrency.offers.find(
      (offer) => offer.discountedPrice === paidAmount
    );

    // Fallback to basePrice
    if (!matchedOffer && priceForCurrency.basePrice === paidAmount) {
      matchedOffer = { days: 30 };
    }

    if (!matchedOffer) throw new Error("No matching offer found for this amount");

    // ✅ Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + matchedOffer.days);

    // ✅ Update payment
    await Payment.findOneAndUpdate(
      { userId, planId, status: "pending" },
      {
        status: "completed",
        paymentId: razorpay_payment_id,
        expirationDate,
      }
    );

    user.planId = plan._id;
    user.isActive = true;
    await user.save();

    return {
      status: "completed",
      paymentId: razorpay_payment_id,
      amount: paidAmount,
      currency: orderData.currency,
      expirationDate,
    };
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    throw error;
  }
};


/**
 * Record failed payments from client
 */
paymentService.recordRazorpayFailure = async (body) => {
  try {
    const { razorpay_order_id, error } = body;
    if (razorpay_order_id) {
      await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: "failed",
          reason: JSON.stringify(error || body),
        },
        { upsert: true }
      );
    } else {
      await Payment.create({
        status: "failed",
        reason: JSON.stringify(body),
      });
    }
    return { success: true };
  } catch (error) {
    console.error("recordRazorpayFailure error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Webhook Handler
 */
paymentService.handleRazorpayWebhook = async (req) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body; // Use raw body in middleware

    const expected = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(body))
      .digest("hex");

    if (expected !== signature) throw new Error("Invalid webhook signature");

    const event = body.event;
    const paymentEntity = body.payload.payment?.entity;

    if (event === "payment.captured" || event === "payment.authorized") {
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      await Payment.findOneAndUpdate(
        { orderId },
        { status: "completed", paymentId },
        { upsert: true }
      );
    }

    if (event === "payment.failed") {
      const orderId = paymentEntity.order_id;
      await Payment.findOneAndUpdate(
        { orderId },
        {
          status: "failed",
          reason: paymentEntity.error_description || "failed",
        },
        { upsert: true }
      );
    }

    return true;
  } catch (error) {
    console.error("handleRazorpayWebhook error:", error);
    throw error;
  }
};

paymentService.sendExpiryReminders = async () => {
  try {
    const now = new Date();
    const payments = await Payment.find({ status: "completed" })
      .populate("userId")
      .populate("planId");

    for (const payment of payments) {
      if (!payment.expirationDate || !payment.userId?.email) continue;

      const diffMs = payment.expirationDate - now;
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const diffHours = diffMs / (1000 * 60 * 60);

      let remaining = "";
      let updateField = "";

      if (diffDays <= 7 && diffDays > 6 && !payment.reminder7dSent) {
        remaining = "7 days";
        updateField = "reminder7dSent";
      } else if (diffDays <= 3 && diffDays > 2 && !payment.reminder3dSent) {
        remaining = "3 days";
        updateField = "reminder3dSent";
      } else if (diffHours <= 24 && diffHours > 23 && !payment.reminder24hSent) {
        remaining = "24 hours";
        updateField = "reminder24hSent";
      } else if (diffHours <= 1 && diffHours > 0 && !payment.reminder1hSent) {
        remaining = "1 hour";
        updateField = "reminder1hSent";
      }

      if (remaining) {
        await sendPlanExpiryReminder({
          email: payment.userId.email,
          name: payment.userId.firstName || payment.userId.name,
          planTitle: payment.planId?.title || "your plan",
          remaining,
        });

        payment[updateField] = true;
        await payment.save();
      }
    }

    return { success: true, message: "Reminders processed successfully" };
  } catch (error) {
    console.error("Error sending expiry reminders:", error);
    throw new Error("Failed to send expiry reminders");
  }
};

module.exports = paymentService