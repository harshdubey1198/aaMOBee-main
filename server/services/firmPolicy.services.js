const FirmPolicy = require("../schemas/firmPolicy.schema");

const firmPolicyServices = {};

// CREATE
firmPolicyServices.create = async (body, user) => {
  if (!body.firmId) throw new Error("firmId is required");

  const exists = await FirmPolicy.findOne({ firmId: body.firmId });
  if (exists) throw new Error("Policy already exists for this firm");

  return FirmPolicy.create({
    ...body,
    createdBy: user._id
  });
};

// READ (by firm)
firmPolicyServices.getByFirm = async (firmId) => {
  if (!firmId) throw new Error("firmId required");

  return FirmPolicy.findOne({ firmId });
};

// UPDATE
firmPolicyServices.update = async (policyId, body) => {
  return FirmPolicy.findByIdAndUpdate(
    policyId,
    body,
    { new: true }
  );
};

// DELETE
firmPolicyServices.remove = async (policyId) => {
  return FirmPolicy.findByIdAndDelete(policyId);
};

firmPolicyServices.changeStatus = async (policyId, status) => {
  if (!["active", "inactive"].includes(status)) {
    throw new Error("Invalid status value");
  }

  return FirmPolicy.findByIdAndUpdate(
    policyId,
    { status },
    { new: true }
  );
};

module.exports = firmPolicyServices;
