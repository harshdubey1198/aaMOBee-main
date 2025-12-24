const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // memory storage
const { tokenVerification } = require('../middleware/auth.middleware');
const invoiceController = require('../controllers/invoice.controller')
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

// Create a new Inventory Item
router.post('/create-invoice', tokenVerification, invoiceController.createInvoice);
router.put('/edit-invoice/:invoiceId', tokenVerification, invoiceController.editInvoice);
router.get('/get-invoices/:id', tokenVerification, invoiceController.getInvoices);
router.get('/get-invoice/:id', tokenVerification, invoiceController.getInvoice);
router.delete('/delete-invoice/:id', tokenVerification, invoiceController.deleteInvoice);
router.put('/update-invoice-approval', tokenVerification, invoiceController.updateInvoiceApproval);
router.put('/update-due-status/:id', tokenVerification, invoiceController.updateInvoiceStatus);
router.get('/count-invoices/:firmId', tokenVerification, invoiceController.countInvoices);
router.put('/reject-invoice/:id', tokenVerification, invoiceController.rejectInvoice);
// router.post('/import-invoices',tokenVerification,upload.single('file'),invoiceController.importInvoices);

// router.post('/send-invoice-email', tokenVerification, upload.single('pdf'), invoiceController.sendInvoiceEmail);
router.post('/send-invoice-email',  tokenVerification,  invoiceController.sendInvoiceEmail);

module.exports = router;
