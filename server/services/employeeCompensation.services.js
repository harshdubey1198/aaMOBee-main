const EmployeeCompensation = require("../schemas/employeeCompensation.schema");
const FirmPolicy = require("../schemas/firmPolicy.schema");
const OnboardingJob = require("../schemas/onboardingJob.schema");

const services = {};

const generateSalaryArray = (policy, ctc, start, end = new Date()) => {
  const data = [];
  const date = new Date(start);

  while (date <= end) {
    const basic = (ctc * policy.basicPercent) / 100 / 12;
    const hra = (ctc * policy.hraPercent) / 100 / 12;

    const allowances = policy.allowances.map(a => ({
      name: a.name,
      amount: (ctc * a.percent) / 100 / 12
    }));

    data.push({
      month: `${date.getFullYear()}-${date.getMonth() + 1}`,
      basic,
      hra,
      allowances,
      total:
        basic +
        hra +
        allowances.reduce((s, a) => s + a.amount, 0)
    });

    date.setMonth(date.getMonth() + 1);
  }

  return data;
};

// CREATE / GENERATE
services.create = async ({
  employeeId,
  firmId,
  onboardingJobId,
  joiningDate,
  endDate
}) => {

  const policy = await FirmPolicy.findOne({ firmId });
  if (!policy) throw new Error("Firm policy missing");

  const job = await OnboardingJob.findById(onboardingJobId);
  if (!job) throw new Error("Job not found");

  const salaryArray = generateSalaryArray(
    policy,
    job.ctc,
    joiningDate,
    endDate
  );

  return EmployeeCompensation.create({
    employeeId,
    firmId,
    offerCTC: job.ctc,
    salaryBreakdown: salaryArray
  });
};

// READ (by employee)
services.getByEmployee = async (employeeId) => {
  return EmployeeCompensation.findOne({ employeeId });
};

// UPDATE (recalculate)
services.update = async (compensationId, body) => {
  return EmployeeCompensation.findByIdAndUpdate(
    compensationId,
    body,
    { new: true }
  );
};

// DELETE
services.remove = async (compensationId) => {
  return EmployeeCompensation.findByIdAndDelete(compensationId);
};

module.exports = services;
