const EmployeeCompensation = require("../schemas/employeeCompensation.schema");
const FirmPolicy = require("../schemas/firmPolicy.schema");
const OnboardingJob = require("../schemas/onboardingJob.schema");

const services = {};

const generateSalaryArray = (policy, ctc, start, end = new Date()) => {
  const safeCTC = Number(ctc);

  if (isNaN(safeCTC)) {
    throw new Error("CTC must be a valid number");
  }

  const data = [];
  const date = new Date(start);

  while (date <= end) {
    const basic = Number(((safeCTC * policy.basicPercent) / 100 / 12).toFixed(2));
    const hra = Number(((safeCTC * policy.hraPercent) / 100 / 12).toFixed(2));

    const allowances = policy.allowances.map(a => ({
      name: a.name,
      amount: Number(((safeCTC * a.percent) / 100 / 12).toFixed(2))
    }));

    const total = Number((
      basic +
      hra +
      allowances.reduce((s, a) => s + a.amount, 0)
    ).toFixed(2));

    data.push({
      month: `${date.getFullYear()}-${date.getMonth() + 1}`,
      basic,
      hra,
      allowances,
      total
    });

    date.setMonth(date.getMonth() + 1);
  }

  return data;
};

// ✅ CREATE / GENERATE
services.create = async ({
  employeeId,
  firmId,
  onboardingJobId,
  joiningDate,
  endDate,
  ctc
}) => {

  if (!ctc || isNaN(Number(ctc))) {
    throw new Error("CTC must be a valid number");
  }

  const policy = await FirmPolicy.findOne({ firmId });
  if (!policy) throw new Error("Firm policy missing");

  // Optional: keep job check only for relation validation
  if (onboardingJobId) {
    const job = await OnboardingJob.findById(onboardingJobId);
    if (!job) throw new Error("Job not found");
  }

  const salaryArray = generateSalaryArray(
    policy,
    Number(ctc),
    joiningDate,
    endDate
  );

  return EmployeeCompensation.create({
    employeeId,
    firmId,
    offerCTC: Number(ctc),
    salaryBreakdown: salaryArray
  });
};

services.getByEmployee = async (employeeId) => {
  return EmployeeCompensation.findOne({ employeeId });
};

services.update = async (compensationId, body) => {
  return EmployeeCompensation.findByIdAndUpdate(
    compensationId,
    body,
    { new: true }
  );
};

services.remove = async (compensationId) => {
  return EmployeeCompensation.findByIdAndDelete(compensationId);
};

module.exports = services;
