// bankFieldOptions.js

const bankFieldOptions = [
  // Common Fields
  { value: "country", label: "Country" },
  { value: "bankName", label: "Bank Name" },
  { value: "accountHolder", label: "Account Holder" },
  { value: "accountNumber", label: "Account Number" },
  { value: "branchName", label: "Branch Name" },

  // India-Specific
  { value: "ifscCode", label: "IFSC Code" },
  { value: "cifNumber", label: "CIF Number" },
  { value: "gstin", label: "GSTIN" },
  { value: "panNumber", label: "PAN Number" },
  { value: "udyamNumber", label: "Udyam Number" },

  // UAE-Specific
  { value: "iban", label: "IBAN" },
  { value: "swiftCode", label: "SWIFT Code" },
  { value: "vatRegistrationNumber", label: "VAT Registration Number" },
  { value: "tradeLicenseNumber", label: "Trade License Number" },

  // Saudi Arabia-Specific
  { value: "commercialRegistrationNumber", label: "Commercial Registration Number" },

  // Malaysia-Specific
  { value: "taxRegistrationNumber", label: "Tax Registration Number" },
  { value: "ssmRegistrationNumber", label: "SSM Registration Number" },
];

export default bankFieldOptions;
