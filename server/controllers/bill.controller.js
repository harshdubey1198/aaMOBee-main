const billServices = require("../services/bill.services");
const { createResult } = require("../utils/utills");

const billController = {};

billController.createBill = async (req, res) => {
  try {
    const newBill = await billServices.createBill(req.body);
    return res.status(200).json(createResult("Bill created successfully", newBill));
  } catch (error) {
    return res.status(400).json(createResult(null, null, error.message));
  }
};


billController.getBillsByFirmId = async (req, res) => {
    try {
      const firmId = req.params.firmId;
      const bills = await billServices.getBillsByFirmId(firmId);
  
      return res.status(200).json(createResult("Bills fetched successfully", bills));
    } catch (error) {
      console.error("Error fetching bills by firmId:", error.message);
      return res.status(500).json(createResult(null, null, error.message));
    }
  };

  billController.getBillById = async (req, res) => {
    try {
      const billId = req.params.billId;
      const bill = await billServices.getBillById(billId);
  
      return res.status(200).json(createResult("Bill fetched successfully", bill));
    } catch (error) {
      console.error("Error fetching bill by ID:", error.message);
      return res.status(500).json(createResult(null, null, error.message));
    }
  };

  billController.updateBill = async (req, res) => {
    try {
      const billId = req.params.billId;
      const updatedData = req.body;
  
      const updatedBill = await billServices.updateBill(billId, updatedData);
  
      return res.status(200).json(createResult("Bill updated successfully", updatedBill));
    } catch (error) {
      console.error("Error updating bill:", error.message);
      return res.status(500).json(createResult(null, null, error.message));
    }
  };

  billController.deleteBill = async (req, res) => {
    try {
      const billId = req.params.billId;
      const deleted = await billServices.deleteBill(billId);
  
      return res.status(200).json(createResult("Bill deleted successfully", deleted));
    } catch (error) {
      console.error("Error deleting bill:", error.message);
      return res.status(500).json(createResult(null, null, error.message));
    }
  };
  
  

module.exports = billController;
