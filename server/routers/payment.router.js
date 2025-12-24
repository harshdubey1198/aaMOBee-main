const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/payment.controller');
const { tokenVerification } = require('../middleware/auth.middleware');

router.post('/create-payment', tokenVerification, paymentController.createPayment)
router.post('/create-checkout-session', paymentController.createCheckoutSession)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.get('/verify-payment', paymentController.verifyPayment);
router.get('/get-payment', tokenVerification, paymentController.getPayment);
router.put('/update-payment/:id', tokenVerification, paymentController.updatePayment);
router.delete('/delete-payment/:id', tokenVerification, paymentController.deletePayment);
router.get('/superadminn/all-payments', paymentController.getAllPayments);
router.get('/payment-detail/:id', paymentController.getUserPayments);
router.post("/free-plan", paymentController.createFreePlanPayment);
router.post('/send-expiry-reminders', paymentController.sendExpiryReminders);

// Razorpay
router.post('/razorpay/create-order',  paymentController.createRazorpayOrder); // create order (auth protected)
router.post('/razorpay/verify-payment', paymentController.verifyRazorpayPayment); // verify after client success (no auth required)
router.post('/razorpay/failure', paymentController.recordRazorpayFailure); // optional: record client-side failures
router.post('/razorpay/webhook', express.raw({ type: 'application/json' }), paymentController.handleRazorpayWebhook); // webhook (raw body)

module.exports = router