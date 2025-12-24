const Invoice = require('../schemas/invoice.schema');
const InvoiceServices = require('../services/invoice.services');
const { createResult } = require('../utils/utills');
const Firm = require('../schemas/user.schema');
const { generateInvoicePdf } = require('../utils/pdfGenerator');
const { sendInvoiceEmail } = require('../utils/mailer');



const invoiceController = {};
invoiceController.importInvoices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }
    if (!req.body.firmId) {
      return res.status(400).json({ message: "firmId is required" });
     }

    const importedInvoices = await InvoiceServices.importInvoices(
      req.file.path,
      req.user._id,
      req.file.originalname,
      req.body.firmId
    );

    return res.status(200).json(
      createResult("Invoices imported successfully", importedInvoices)
    );
  } catch (error) {
    console.error("Import Invoices Error:", error);
    return res.status(500).json(createResult(null, null, error.message));
  }
};
// CREATE INVOICES
invoiceController.createInvoice = async (req, res) => {
    try {
        const invoice = await InvoiceServices.createInvoice(req.body);
        return res.status(200).json(createResult("Invoice created successfully", invoice));
    } catch (error) {
        console.log(error, "error")
        return res.status(400).json(createResult(null, null, error.message));
    }
};

invoiceController.editInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const invoice = await InvoiceServices.updateInvoice(invoiceId, req.body);
    return res.status(200).json(createResult("Invoice updated successfully", invoice));
  } catch (error) {
    console.log("Edit Invoice Error:", error);
    return res.status(400).json(createResult(null, null, error.message));
  }
};



// REJECT PERFORMA INVOICE 
invoiceController.rejectInvoice = async (req, res) => {
    try {
        const invoiceId = req.params.id;
        const rejectedInvoice = await InvoiceServices.rejectInvoice(invoiceId);
        return res.status(200).json(createResult("Invoice rejected successfully", rejectedInvoice));
    } catch (error) {
        console.error(error);
        return res.status(400).json(createResult(null, null, error.message));
    }
};  

// GET INVOICES
invoiceController.getInvoices = async (req, res) => {
    try {
        const invoices = await InvoiceServices.getInvoices(req.params.id);
        return res.status(200).json(createResult("All Invoices Fetched successfully", invoices));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// GET SINGLE INVOICE
invoiceController.getInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceServices.getInvoice(req.params.id);

    return res.status(200).json({
      message: "Fetch invoice data successfully",
      data: invoice, // ✅ Directly wrap the invoice object in 'data'
      error: null
    });

  } catch (error) {
    return res.status(400).json({
      message: null,
      data: null,
      error: error.message || "Something went wrong"
    });
  }
};

// DELETE INVOICES
invoiceController.deleteInvoice = async (req, res) => {
    try {
        const invoice = await InvoiceServices.deleteInvoice(req.params.id);
        return res.status(200).json(createResult("Invoice deleted successfully", invoice));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// update invoice approval
invoiceController.updateInvoiceApproval = async (req, res) => {
    try {
        const invoice = await InvoiceServices.updateInvoiceApproval(req.body);
        return res.status(200).json(createResult("Invoice approval updated successfully", invoice));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

//update invoice due amount status
invoiceController.updateInvoiceStatus = async(req,res) => {
    try{
        const { id: invoiceId } = req.params;
      const { amountDue } = req.body;
    //   console.log("InvoiceId = ", invoiceId);

      if(amountDue === undefined || amountDue < 0){
        return res.status(400).json({message: "Invalid amountDue value."});
      }

      const updatedInvoice = await InvoiceServices.updateInvoiceStatus(invoiceId, amountDue);
      res.status(200).json({
      message: "Invoice due status updated successfully",
      invoice: updatedInvoice
    });
    }catch(error){
    console.error("Error updating due status:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// count invoices
invoiceController.countInvoices = async (req, res) => {
    try {
        const invoicecount = await InvoiceServices.countInvoices(req.params.firmId);
        return res.status(200).json(createResult("Get Invoice Count successfully", invoicecount));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

invoiceController.sendInvoiceEmail = async (req, res) => {
  try {
    const { firmId, invoiceId, to, layout = 'layout1' } = req.body;
    if (!firmId || !invoiceId || !to) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const firm = await Firm.findById(firmId).lean();

    // ✅ populate itemId so template gets product details
    const invoice = await Invoice.findById(invoiceId)
      .populate("items.itemId")
      .lean();

    if (!firm || !invoice) {
      return res.status(404).json({ message: 'Firm or Invoice not found' });
    }

    // 1️⃣ Generate PDF
    const pdfBuffer = await generateInvoicePdf(invoice, firm, layout);

    // 2️⃣ Send email
    await sendInvoiceEmail({ firm, to, invoice, pdfBuffer });

    return res.status(200).json({ message: 'Invoice email sent' });
  } catch (error) {
    console.error('sendInvoiceEmail error:', error);
    return res.status(500).json({ message: error.message || 'Failed to send invoice email' });
  }
};




module.exports = invoiceController;
