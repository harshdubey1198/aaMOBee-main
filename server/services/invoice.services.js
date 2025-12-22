const Customer = require("../schemas/cutomer.schema");
const Invoice = require("../schemas/invoice.schema");
const User = require("../schemas/user.schema");
const InventoryItem = require("../schemas/inventoryItem.schema");
const Tax = require("../schemas/tax.schema");
const { handleCustomer, calculateInvoiceAmount, generateInvoiceNumber, updateInventoryStock, releaseReservedStock } = require("../utils/invoiceutility");
const { default: mongoose } = require("mongoose");

const invoiceServices = {};

invoiceServices.createInvoice = async (invoiceData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer,
      items,
      invoiceDate,
      dueDate,
      amountPaid,
      createdBy,
      firmId,
      invoiceType,
      invoiceSubType,
      notes,
       invoiceLayout
    } = invoiceData;
    
    const firmUser = await User.findById(firmId);
    if (!firmUser) {
        throw new Error('Firm user not found');
    }

    const invoiceCurrency = firmUser.currency || 'INR';
    // Handle customer creation or retrieval
    const customerData = await handleCustomer(customer, firmId, createdBy, session);

    // Calculate total amount
    const totalAmount = await calculateInvoiceAmount(items, session);

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(firmId, session);
    const amountDue = Math.max((totalAmount - amountPaid).toFixed(2), 0);

    const newInvoice = new Invoice({
      invoiceNumber,
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone,
      customerAddress: customerData.customerAddress,
      invoiceType,
      invoiceSubType,
      amountPaid,
      amountDue,
      firmId,
      items,
      invoiceDate,
      invoiceCurrency,
      dueDate,
      totalAmount,
      createdBy,
      notes,
      invoiceLayout
    });

    if (invoiceType === "Proforma") {
      await updateInventoryStock(items, true, session);
    } else if (invoiceType === "Tax Invoice") {
      await updateInventoryStock(items, false, session);
    }

    const savedInvoice = await newInvoice.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return savedInvoice;
  } catch (error) {
    // Rollback transaction if anything fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

invoiceServices.updateInvoice = async (invoiceId, invoiceData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      customer,
      items,
      invoiceDate,
      dueDate,
      amountPaid,
      createdBy,
      firmId,
      invoiceType,
      invoiceSubType,
      notes,
      invoiceLayout
    } = invoiceData;

    const firmUser = await User.findById(firmId);
    if (!firmUser) {
      throw new Error('Firm user not found');
    }

    const invoiceCurrency = firmUser.currency || 'INR';

    // Handle customer creation or retrieval
    const customerData = await handleCustomer(customer, firmId, createdBy, session);

    // Calculate total amount
    const totalAmount = await calculateInvoiceAmount(items, session);

    const amountDue = Math.max((totalAmount - amountPaid).toFixed(2), 0);

    // Find the invoice to update
    const existingInvoice = await Invoice.findById(invoiceId).session(session);
    if (!existingInvoice) {
      throw new Error('Invoice not found');
    }

    // Optional: Rollback previous inventory update if needed
    // await rollbackInventoryStock(existingInvoice.items, session);

    // Update inventory again for new items
    if (invoiceType === "Proforma") {
      await updateInventoryStock(items, true, session);
    } else if (invoiceType === "Tax Invoice") {
      await updateInventoryStock(items, false, session);
    }

    // Update invoice fields
    Object.assign(existingInvoice, {
      customerName: customerData.customerName,
      customerEmail: customerData.customerEmail,
      customerPhone: customerData.customerPhone,
      customerAddress: customerData.customerAddress,
      invoiceType,
      invoiceSubType,
      amountPaid,
      amountDue,
      items,
      invoiceDate,
      invoiceCurrency,
      dueDate,
      totalAmount,
      notes,
      invoiceLayout
    });

    const updatedInvoice = await existingInvoice.save({ session });

    await session.commitTransaction();
    session.endSession();

    return updatedInvoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


// PERFORMA INVOICE GETS REJECTED
invoiceServices.rejectInvoice = async (invoiceId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const invoice = await Invoice.findById(invoiceId).session(session);
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }
    if (invoice.invoiceType !== "Proforma") {
      throw new Error("Only Proforma invoices can be rejected");
    }
    if (["rejected", "Canceled"].includes(invoice.status)) {
      throw new Error("This invoice has already been rejected or canceled");
    }
    invoice.status = "rejected";
    await releaseReservedStock(invoice.items, session);
    await invoice.save({ session });
    await session.commitTransaction();
    session.endSession();
    return invoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

invoiceServices.getInvoices = async (adminId) => {
  const invoices = await Invoice.find({ firmId: adminId, deleted_at: null })
    .populate({ 
      path: "items.itemId", 
      populate: [
        { path: "tax.taxId", select: "taxName taxRates" }, 
        { path: "categoryId", select: "categoryName" }, 
        { path: "subcategoryId", select: "categoryName" }, 
        { path: "brand", select: "name" }, 
        { path: "vendor", select: "name contactPerson phone email" } 
      ] 
    })
    .populate({ path: "firmId", select: "-password" })
    .populate({ path: "createdBy", select: "firstName lastName email" })
    .lean(); 

  if (invoices.length === 0) {
    throw new Error("No Invoices found");
  }

  for (const invoice of invoices) {
    for (const item of invoice.items) {
      if (item.itemId?.tax && item.itemId.tax.selectedTaxTypes?.length > 0 && item.itemId.tax.taxId?.taxRates) {
        item.itemId.tax.selectedTaxTypes = item.itemId.tax.taxId.taxRates.filter(rate =>
          item.itemId.tax.selectedTaxTypes.some(id => id.toString() === rate._id.toString())
        );
      }
    }
  }

  return invoices;
};

invoiceServices.getInvoice = async (invoiceId) => {
  const invoice = await Invoice.findOne({ _id: invoiceId, deleted_at: null })
    .populate({ 
      path: "items.itemId", 
      populate: [
        { path: "tax.taxId", select: "taxName taxRates" },
        { path: "categoryId", select: "categoryName" }, 
        { path: "subcategoryId", select: "categoryName" }, 
        { path: "brand", select: "name" }, 
        { path: "vendor", select: "name contactPerson phone email" } 
      ] 
    })
    .populate({ path: "firmId", select: "-password" })
    .populate({ path: "createdBy", select: "firstName lastName email" })
    .lean(); 

  if (!invoice) {
    throw new Error("No invoice found");
  }

  for (const item of invoice.items) {
    if (item.itemId?.tax && item.itemId.tax.selectedTaxTypes?.length > 0 && item.itemId.tax.taxId?.taxRates) {
      item.itemId.tax.selectedTaxTypes = item.itemId.tax.taxId.taxRates.filter(rate =>
        item.itemId.tax.selectedTaxTypes.some(id => id.toString() === rate._id.toString())
      );
    }
  }

  return invoice;
};

invoiceServices.deleteInvoice = async (invoiceId) => {
  const existingInvoice = await Invoice.findOne({ _id: invoiceId });
  if (!existingInvoice) {
    throw new Error("No Invoices found");
  }

  const deletedInvoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId },
    { deleted_at: Date.now() },
    { new: true }
  );
  return deletedInvoice;
};

invoiceServices.updateInvoiceApproval = async (body) => {
  const { id, userId, approvalStatus } = body;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new Error("User not found");
  }

  const invoice = await Invoice.findOne({ _id: id });
  if (!invoice) {
    throw new Error("Invoice not found");
  }

  const allowedStatuses = ['pending', 'approved', 'rejected'];

  if (!allowedStatuses.includes(approvalStatus)) {
    throw new Error(`Invalid approval status. Allowed values: ${allowedStatuses.join(', ')}`);
  }

  if (
  invoice.firmId !== user.adminId &&
  user.role !== "firm_admin" &&
  user.role !== "client_admin"
) {
  console.log("❌ Authorization Failed");
  console.log("invoice.firmId:", invoice.firmId);
  console.log("user.adminId:", user.adminId);
  console.log("user.role:", user.role);
  throw new Error(
    "Only Firm Admin or Client Admin is authorized to update the Approval of Invoices"
  );
}

console.log("✅ Passed Authorization Check");
console.log("user.role:", user.role);
console.log("approvalStatus to set:", approvalStatus);

const updatedInvoice = await Invoice.findOneAndUpdate(
  { _id: id, firmId: invoice.firmId },
  { $set: { approvalStatus } },
  { new: true }
);


console.log("⚠️ No update performed — role not matched.");

};

invoiceServices.updateInvoiceStatus = async(invoiceId, amountDue) => {
  if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
    throw new Error("Invalid invoice ID format");
  }
  const invoice = await Invoice.findOne({ _id: invoiceId, deleted_at: null });
  if (!invoice) throw new Error("Invoice not found");

    invoice.amountDue = amountDue;
    
  // If amountDue is 0, mark invoice as 'paid' and set amountPaid to totalAmount
  if (amountDue === 0) {
    invoice.status = 'paid';
    invoice.amountPaid = invoice.totalAmount;
  } else {
    invoice.status = 'unpaid';
    invoice.amountPaid = invoice.totalAmount - amountDue;
  }

  await invoice.save();
  return invoice;
}

invoiceServices.countInvoices = async (firmId) => {
  const count = await Invoice.countDocuments({
    firmId: firmId,
    deleted_at: null,
  });
  return count;
};

module.exports = invoiceServices;
