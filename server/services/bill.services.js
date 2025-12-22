const nodemailer = require("nodemailer");
const moment = require("moment");
const generateTemporaryPassword = require("../utils/tempPassword");
const PasswordService = require('./password.services');
const User = require("../schemas/user.schema");
const multer = require("multer");
const uploadToCloudinary = require("../utils/cloudinary");
const Plan = require("../schemas/plans.schema");
const crypto = require("crypto");
const { sendCredentialsEmail, generateOtp } = require("../utils/mailer");
const Payment = require("../schemas/payment.schema");
const { validateUserSubscription } = require("../helpers/validateSubscription");
const ManualBill = require('../schemas/bill.schema'); // Adjust path
const billServices = {};


// billServices.createBill = async (data) => {
//     try {
//       // 1. Prepare current date
//       const now = moment();
//       const dateStr = now.format("MM-DD");
  
//       // 2. Find how many bills already exist for today
//       const todayStart = now.startOf('day').toDate();
//       const todayEnd = now.endOf('day').toDate();
  
//       const billCount = await ManualBill.countDocuments({
//         billDate: { $gte: todayStart, $lte: todayEnd }
//       });
  
//       const billNumber = `BILL-${dateStr}-${String(billCount + 1).padStart(3, '0')}`; // e.g., BILL-04-12-001
  
//       // 3. Calculate item totals
//       const itemsWithTotal = data.items.map(item => {
//         const base = item.price * item.quantity;
//         const taxAmount = (item.tax || 0) * base / 100;
//         return {
//           ...item,
//           total: base + taxAmount
//         };
//       });
  
//       let subtotal = itemsWithTotal.reduce((sum, item) => sum + item.total, 0);
//       let finalAmount = subtotal;
  
//       // 4. Apply overall discount
//       const discount = data.overallDiscount || 0;
//       if (data.discountType === 'percentage') {
//         finalAmount -= (finalAmount * discount) / 100;
//       } else if (data.discountType === 'flat') {
//         finalAmount -= discount;
//       }
  
//       // 5. Save Bill
//       const newBill = new ManualBill({
//         ...data,
//         billNumber,
//         items: itemsWithTotal,
//         totalAmount: finalAmount
//       });
  
//       return await newBill.save();
  
//     } catch (error) {
//       throw new Error("Failed to create bill: " + error.message);
//     }
//   };


billServices.createBill = async (data) => {
  try {
      const now = moment();
      const dateStr = now.format("MM-DD");

      const todayStart = now.startOf('day').toDate();
      const todayEnd = now.endOf('day').toDate();

      const billCount = await ManualBill.countDocuments({
          billDate: { $gte: todayStart, $lte: todayEnd }
      });

      const billNumber = `BILL-${dateStr}-${String(billCount + 1).padStart(3, '0')}`;

      const firmUser = await User.findById(data.firmId);
      if (!firmUser) {
          throw new Error('Firm user not found');
      }
      // console.log("Firm User:", firmUser.currency);
      const billCurrency = firmUser.currency || 'INR';  

      const itemsWithTotal = data.items.map(item => {
          const base = item.price * item.quantity;
          const taxAmount = (item.tax || 0) * base / 100;
          return {
              ...item,
              total: base + taxAmount
          };
      });

      let subtotal = itemsWithTotal.reduce((sum, item) => sum + item.total, 0);
      let finalAmount = subtotal;

      const discount = data.overallDiscount || 0;
      if (data.discountType === 'percentage') {
          finalAmount -= (finalAmount * discount) / 100;
      } else if (data.discountType === 'flat') {
          finalAmount -= discount;
      }

      const newBill = new ManualBill({
          ...data,
          billNumber,
          billCurrency, 
          items: itemsWithTotal,
          totalAmount: finalAmount
      });

      return await newBill.save();

  } catch (error) {
      throw new Error("Failed to create bill: " + error.message);
  }
};

  billServices.getBillsByFirmId = async (firmId) => {
    try {
      const bills = await ManualBill.find({ firmId });
      if (!bills.length) {
        throw new Error("No bills found for this firm");
      }
      return bills;
    } catch (error) {
      console.error("Error in getBillsByFirmId:", error.message);
      throw new Error("Failed to fetch bills: " + error.message);
    }
  };

  billServices.getBillById = async (billId) => {
    try {
      const bill = await ManualBill.findById(billId);
  
      if (!bill) {
        throw new Error("Bill not found");
      }
  
      return bill;
    } catch (error) {
      console.error("Error in getBillById:", error.message);
      throw new Error("Failed to fetch bill: " + error.message);
    }
  };


  billServices.updateBill = async (billId, data) => {
    try {
      if (data.items && Array.isArray(data.items)) {
        // Recalculate item totals and grand total if items are updated
        data.items = data.items.map(item => {
          const base = item.price * item.quantity;
          const taxAmount = (item.tax || 0) * base / 100;
          return {
            ...item,
            total: base + taxAmount
          };
        });
  
        let total = data.items.reduce((sum, item) => sum + item.total, 0);
  
        if (data.overallDiscount && data.discountType === 'percentage') {
          total -= (total * data.overallDiscount) / 100;
        } else if (data.overallDiscount && data.discountType === 'flat') {
          total -= data.overallDiscount;
        }
  
        data.totalAmount = total;
      }
  
      const updatedBill = await ManualBill.findByIdAndUpdate(billId, data, { new: true });
  
      if (!updatedBill) {
        throw new Error("Bill not found");
      }
  
      return updatedBill;
    } catch (error) {
      throw new Error("Failed to update bill: " + error.message);
    }
  };

  billServices.deleteBill = async (billId) => {
    try {
      const deletedBill = await ManualBill.findByIdAndUpdate(
        billId,
        { deleted_at: new Date() },
        { new: true }
      );
  
      if (!deletedBill) {
        throw new Error("Bill not found");
      }
  
      return deletedBill;
    } catch (error) {
      throw new Error("Failed to delete bill: " + error.message);
    }
  };
  
  
  

module.exports = billServices;

 