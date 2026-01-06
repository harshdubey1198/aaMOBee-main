const EmployeeVerification = require("../schemas/employeeVerification.schema");

const services = {};

// CREATE (initial record)
services.create = async (employeeId) => {
  return EmployeeVerification.create({ employeeId });
};

// READ
services.getByEmployee = async (employeeId) => {
  return EmployeeVerification.findOne({ employeeId });
};

// UPDATE DOCUMENTS
services.updateDocuments = async (employeeId, documents) => {
  return EmployeeVerification.findOneAndUpdate(
    { employeeId },
    { $push: { documents: { $each: documents } } },
    { new: true, upsert: true }
  );
};

// UPDATE FACE VERIFICATION
services.updateFace = async (employeeId, data) => {
  return EmployeeVerification.findOneAndUpdate(
    { employeeId },
    { faceVerification: data },
    { new: true }
  );
};

// APPROVE
services.approve = async (employeeId, adminId) => {
  return EmployeeVerification.findOneAndUpdate(
    { employeeId },
    {
      approval: {
        status: "approved",
        approvedBy: adminId,
        approvedAt: new Date()
      },
      loginEnabled: true
    },
    { new: true }
  );
};

// REJECT
services.reject = async (employeeId, adminId) => {
  return EmployeeVerification.findOneAndUpdate(
    { employeeId },
    {
      approval: {
        status: "rejected",
        approvedBy: adminId,
        approvedAt: new Date()
      },
      loginEnabled: false
    },
    { new: true }
  );
};

// DELETE
services.remove = async (employeeId) => {
  return EmployeeVerification.findOneAndDelete({ employeeId });
};

module.exports = services;
