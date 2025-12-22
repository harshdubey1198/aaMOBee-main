const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller');

router.post('/create-bill', billController.createBill);
router.get('/get-bills-by-firm/:firmId', billController.getBillsByFirmId);
router.get('/get-bill-by-id/:billId', billController.getBillById);
router.put('/update-bill/:billId', billController.updateBill);
router.delete('/delete-bill/:billId', billController.deleteBill);




module.exports = router;
