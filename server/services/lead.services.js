const Lead = require("../schemas/lead.schema");
const csvtojson = require("csvtojson");
const { Parser } = require("json2csv");
const mongoose = require("mongoose");
const XLSX = require("xlsx");
const iconv = require("iconv-lite");
const CRMUser = require("../schemas/crmUser.schema");
const User = require("../schemas/user.schema");

const leadService = {};

const populateMixedUser = async (userId) => {
  const crm = await CRMUser.findById(userId).populate("roleId", "roleName").lean();
  if (crm) {
    return {
      _id: crm._id,
      firstName: crm.firstName,
      lastName: crm.lastName,
      email: crm.email,
      role: crm.roleId?.roleName || "CRM User"
    };
  }
  const user = await User.findById(userId).lean();
  if (user) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || "User"
    };
  }
  return null;
};

leadService.createLead = async (body) => {
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    adId,
    adName,
    adSetId,
    campaignId,
    formId,
    formName,
    isOrganic,
    platform,
    phoneNumber,
    lastQualification,
    yearOfPassout,
    status,
  } = body;

  const leadStatus = "new";

  const newLead = new Lead({
    ...body, 
    status: leadStatus, 
  });

  await newLead.save();
  return newLead;
};

// leadService.importLeads = async (fileBuffer, firmId, originalFileName) => {
//   try {
//     let leads = [];

//     const fileExtension = originalFileName.split('.').pop().toLowerCase();

//     if (fileExtension === "csv") {
//       // Decode the buffer using native UTF-8
//       const cleanedBuffer = fileBuffer.toString("utf8").replace(/\0/g, '');
//       leads = await csvtojson().fromString(cleanedBuffer);
//     } else if (fileExtension === "xlsx" || fileExtension === "xls") {
//       const workbook = XLSX.read(fileBuffer, { type: "buffer" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       leads = XLSX.utils.sheet_to_json(sheet, { defval: "" });
//     } else {
//       throw new Error("Unsupported file type. Only CSV and Excel (.xls, .xlsx) are allowed.");
//     }

//     if (!leads || leads.length === 0) {
//       throw new Error("No data found in the uploaded file.");
//     }

//     const processedLeads = leads.map((lead) => ({
//       ...lead,
//       status: "new",
//       firmId,
//     }));

//     const savedLeads = await Lead.insertMany(processedLeads);
//     return savedLeads;
//   } catch (error) {
//     console.error("Error processing leads:", error.message);
//     throw new Error(error.message || "Failed to process leads");
//   }
// };

leadService.importLeads = async (fileBuffer, firmId, originalFileName) => {
  try {
    let leads = [];

    const fileExtension = originalFileName.split('.').pop().toLowerCase();

    if (fileExtension === "csv") {
      const cleanedBuffer = fileBuffer.toString("utf8").replace(/\0/g, '');
      leads = await csvtojson().fromString(cleanedBuffer);
    } else if (["xlsx", "xls"].includes(fileExtension)) {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      leads = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    } else {
      return { error: true, message: "Unsupported file type. Only CSV and Excel (.xls, .xlsx) are allowed." };
    }

    if (!leads || leads.length === 0) {
      return { error: true, message: "No data found in the uploaded file." };
    }

    // 🔹 Normalize headers and ensure firstName + lastName exist
    const normalizeKey = (key) =>
      key.toLowerCase().replace(/\s|_|-/g, "");

    const mappedLeads = leads.map((lead) => {
      const normalizedLead = {};
      for (const key in lead) {
        const normalizedKey = normalizeKey(key);

        if (["firstname", "first"].includes(normalizedKey)) {
          normalizedLead.firstName = lead[key];
        } else if (["lastname", "last"].includes(normalizedKey)) {
          normalizedLead.lastName = lead[key];
        } else {
          normalizedLead[key] = lead[key];
        }
      }

      return {
        ...normalizedLead,
        status: "new",
        firmId,
      };
    });

    // 🔹 Validate required fields
    const invalidRows = mappedLeads.filter(
      (l) => !l.firstName || !l.lastName
    );
    if (invalidRows.length > 0) {
      return {
        error: true,
        message: `Missing required fields (firstName, lastName) in ${invalidRows.length} row(s)`,
        invalidRows,
      };
    }

    const savedLeads = await Lead.insertMany(mappedLeads);
    return { error: false, leads: savedLeads };
  } catch (error) {
    console.error("Error processing leads:", error.message);
    return { error: true, message: error.message || "Failed to process leads" };
  }
};

leadService.exportLeads = async (body) => {
  const { leadIds } = body;

  // Validate lead IDs
  if (!leadIds || leadIds.length === 0) {
    throw new Error("No leads selected for exporting.");
  }

  // Fetch leads from the database
  const leads = await Lead.find({ _id: { $in: leadIds } });

  if (!leads || leads.length === 0) {
    throw new Error("No leads found for the provided IDs.");
  }

  // Dynamically extract all unique fields from the leads
  const allFields = new Set();
  leads.forEach((lead) => {
    Object.keys(lead.toObject()).forEach((field) => allFields.add(field));
  });

  // Convert the leads to CSV format
  const fields = Array.from(allFields);
  const parser = new Parser({ fields });
  const csv = parser.parse(leads);

  return csv;
};


// leadService.getAllLeads = async () => {
//   try {
//     const leads = await Lead.find({ deleted_at: null })
//       .populate({
//         path: "notes",
//         populate: {
//           path: "createdBy",
//           select: "firstName lastName email",
//         },
//       })
//       .populate({
//         path: "assignmentHistory.assignedBy", 
//         select: "firstName lastName",     
//         populate: {
//           path: "roleId",                    
//           select: "roleName",             
//         },     
//       })
//       .populate({
//         path: "assignmentHistory.assignedTo",  
//         select: "firstName lastName",          
//         populate: {
//           path: "roleId",                       
//           select: "roleName",                
//         },
//       });

//     const filteredLeads = leads.map((lead) => ({
//       ...lead._doc,
//       notes: lead.notes.filter((note) => note.deleted_at === null),
//     }));

//     const count = await Lead.countDocuments({ deleted_at: null });

//     if (count === 0) {
//       return { message: "No leads found.", count: 0, leads: [] };
//     }

//     return { count, leads: filteredLeads };
//   } catch (error) {
//     throw new Error("Error fetching leads: " + error.message);
//   }
// };

leadService.getAllLeads = async () => {
  try {
    const leads = await Lead.find({ deleted_at: null })
      .populate({
        path: "notes",
        populate: {
          path: "createdBy",
          select: "firstName lastName email",
        },
      })
      .lean();

    for (const lead of leads) {
      // filter notes
      lead.notes = lead.notes?.filter((note) => !note.deleted_at) || [];

      // Populate assignmentHistory
      for (const history of lead.assignmentHistory || []) {
        history.assignedBy = await populateMixedUser(history.assignedBy);
        history.assignedTo = await populateMixedUser(history.assignedTo);
      }
    }

    const count = await Lead.countDocuments({ deleted_at: null });
    return { count, leads };
  } catch (error) {
    throw new Error("Error fetching leads: " + error.message);
  }
};


leadService.getLeadById = async (leadId) => {
  const lead = await Lead.findOne({ _id: leadId, deleted_at: null })
    .populate({
      path: "notes.createdBy",
      select: "firstName lastName email",
    })
    .lean();

  if (!lead) throw new Error("No lead found.");

  lead.notes = lead.notes?.filter((note) => !note.deleted_at) || [];

  for (const history of lead.assignmentHistory || []) {
    history.assignedBy = await populateMixedUser(history.assignedBy);
    history.assignedTo = await populateMixedUser(history.assignedTo);
  }

  return lead;
};

leadService.getLeadByFirmId = async (firmId) => {
  const leads = await Lead.find({ firmId, deleted_at: null })
    .populate({
      path: "notes.createdBy",
      select: "firstName lastName email",
    })
    .lean();

  if (!leads.length) throw new Error("No lead found.");

  for (const lead of leads) {
    for (const history of lead.assignmentHistory || []) {
      history.assignedBy = await populateMixedUser(history.assignedBy);
      history.assignedTo = await populateMixedUser(history.assignedTo);
    }
  }

  return leads;
};


leadService.updateLead = async (leadId, data) => {
  const updatedLead = await Lead.findOneAndUpdate({ _id: leadId }, data, {
    new: true,
  });
  if (!updatedLead) {
    throw new Error("No lead found, updation failed");
  }
  return updatedLead;
};

// Update lead status and add a note to the lead
leadService.updateLeadStatus = async (leadId, data) => {
  const { status, noteMessage, userId } = data;

  if (!status || !noteMessage || !userId) {
    throw new Error("Status, noteMessage, and userId are required.");
  }

  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw new Error("Lead not found.");
  }

  const oldStatus = lead.status;
  lead.status = status;
  const statusChangeMessage = `Status updated from "${oldStatus}" to "${status}"`;
  const fullNoteMessage = `${statusChangeMessage}. ${noteMessage}`;

  const newNote = {
    message: fullNoteMessage,
    createdBy: mongoose.Types.ObjectId(userId),
    createdAt: new Date(),
  };

  lead.notes.push(newNote);

  const updatedLead = await lead.save();
  if (!updatedLead) {
    throw new Error("Failed to update lead.");
  }
  return updatedLead;
};

leadService.deleteLead = async (leadId) => {
  const deletedLead = await Lead.findOneAndUpdate(
    { _id: leadId },
    { deleted_at: new Date() },
    { new: true }
  );
  if (!deletedLead) {
    throw new Error("No lead found, updation failed");
  }
  return deletedLead;
};
// multiple leads deletion
leadService.deleteMultipleLeads = async (leadIds) => {
  const deletedLeads = await Lead.updateMany(
    { _id: { $in: leadIds } },
    { deleted_at: new Date() }
  );
  if (!deletedLeads) {
    throw new Error("No leads found to delete.");
  }

  return deletedLeads;
};

leadService.addNotesToLead = async (leadId, note) => {
  const updatedLead = await Lead.findOneAndUpdate(
    { _id: leadId, deleted_at: null },
    { $push: { notes: note } },
    { new: true }
  );
  if (!updatedLead) {
    throw new Error("No lead found to update.");
  }

  return updatedLead;
};

leadService.getNotes = async (leadId) => {
  const lead = await Lead.findOne({ _id: leadId }).select("notes");
  if (!lead) {
    throw new Error("Lead not found");
  }
  const activenotes = lead.notes.filter((note) => !note.deleted_at);
  return activenotes;
};

leadService.updateNotesToLead = async (leadId, body) => {
  const { noteId, message } = body;
  const updatedLead = await Lead.findOneAndUpdate(
    { _id: leadId, "notes._id": noteId, "notes.deleted_at": null },
    {
      $set: {
        "notes.$.message": message,
        "notes.$.lastUpdatedAt": new Date(),
      },
    },
    { new: true }
  );

  if (!updatedLead) {
    throw new Error("Lead or note not found.");
  }

  return updatedLead;
};

leadService.deleteNotesToLead = async (leadId, body) => {
  const { noteId } = body;
  const updatedLead = await Lead.findOneAndUpdate(
    { _id: leadId, "notes._id": noteId },
    {
      $set: {
        "notes.$.deleted_at": new Date(),
      },
    },
    { new: true }
  );

  if (!updatedLead) {
    throw new Error("Lead or note not found.");
  }

  return updatedLead;
};

leadService.getExpiredLeadsWithoutUpdatedStatus = async (filterValues) => {
  try {
    const query = {
      deleted_at: null,
    };

    if (filterValues) {
      Object.keys(filterValues).forEach((key) => {
        if (filterValues[key]) {
          query[key] = filterValues[key];
        }
      });
    }

    const leads = await Lead.find(query).populate({
      path: "notes.createdBy",
      select: "firstName lastName email",
    });

    const today = new Date();
    const validStatuses = [
      "contacted",
      "qualified",
      "converted",
      "not interested",
      "False Data",
      "Closed",
    ];

    const filteredLeads = leads
      .filter((lead) => {
        const leadDueDate = lead.dueDate ? new Date(lead.dueDate) : null;
        const isPastDue = leadDueDate && leadDueDate < today;

        return isPastDue && !validStatuses.includes(lead.status);
      })
      .map((lead) => ({
        ...lead._doc,
        notes: lead.notes.filter((note) => !note.deleted_at),
      }));

    return filteredLeads;
  } catch (error) {
    throw new Error("Error fetching missed leads: " + error.message);
  }
};
leadService.updateLeadStatus = async (leadId, data) => {
  const { status, noteMessage, userId } = data;

  if (!status || !noteMessage || !userId) {
    throw new Error("Status, noteMessage, and userId are required.");
  }

  const lead = await Lead.findById(leadId);
  if (!lead) {
    throw new Error("Lead not found.");
  }

  const oldStatus = lead.status;
  lead.status = status;
  const statusChangeMessage = `Status updated from "${oldStatus}" to "${status}"`;
  const fullNoteMessage = `${statusChangeMessage}. ${noteMessage}`;

  const newNote = {
    message: fullNoteMessage,
    createdBy: new mongoose.Types.ObjectId(userId),
    createdAt: new Date(),
  };

  lead.notes.push(newNote);

  const updatedLead = await lead.save();
  if (!updatedLead) {
    throw new Error("Failed to update lead.");
  }
  return updatedLead;
};

module.exports = leadService;
