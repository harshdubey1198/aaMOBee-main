// keep all HRMS permissions here — reuse everywhere

const HRMS_PERMISSIONS = [
  "hr.recruitment.create",
  "hr.recruitment.view",
  "hr.recruitment.update",
  "hr.recruitment.delete",

  "hr.onboarding.manage",
  "hr.onboarding.documents.manage",
  "hr.offerletter.generate",

  "hr.candidates.create",
  "hr.candidates.view",
  "hr.candidates.update",
  "hr.candidates.delete",

  "hr.candidates.manage",

  "hr.interview.schedule",
  "hr.interview.update",
  "hr.interview.feedback",

  "hr.attendance.view",
  "hr.attendance.update",

  "hr.leave.apply",
  "hr.leave.approval",
  "hr.leave.view",

  "hr.payroll.view",
  "hr.payroll.process",

  "hr.appraisal.view",
  "hr.appraisal.update",

  "hr.offboarding.manage",

  "hr.documents.manage",
  "hr.policies.manage",
];

module.exports = {
  HRMS_PERMISSIONS,
};
