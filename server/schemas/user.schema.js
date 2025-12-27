const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const countryEnum = require("../data/commonData/countryEnum")
const currencyEnum = require("../data/commonData/currencyEnum")
const {HRMS_PERMISSIONS}= require("../utils/permissions")
const SmtpSettingsSchema = new Schema(
  {
    host: { type: String },
    port: { type: Number },
    secure: { type: Boolean, default: true },
    user: { type: String },
    pass: { type: String },
    fromEmail: { type: String },
    fromName: { type: String },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salesTracker :{type:Boolean,default:false},
    avatar: {
      type: String,
    },
    isDemo: { type: Boolean, default: false },
    permissionsHolding: [
      {
        type: String,
        enum: HRMS_PERMISSIONS,
      },
    ],
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      default: null,
    },
    birthday: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say", "NA"],
      default: "prefer not to say",
    },
    salesTracker:{type:Boolean , default:false},
    token: { type: String },
    notifiedDemoExpiry: { type: Boolean, default: false },
    expiresAt: { type: Date },
    mobile: { type: String },
    mobileSecondary: {
      countryCode: { type: String},
      number: { type: String },
    },
    companyTelephone: { type: String },
    companyTitle: { type: String },
    companyMobile: { type: String },
    incorporationDate: { type: Date },

    country: {
      type: String,
      enum: countryEnum,
      default: "india",
    },

    currency: {
      type: String,
      enum: currencyEnum,
      default: "INR",
    },

    role: {
      type: String,
      enum: [ 
        "super_admin",
        "client_admin",
        "firm_admin",
        "accountant",
        "employee",
        "firm",
        "blog_admin",
      ],
      required: true,
    },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    cifNumber: { type: String },
    gstin: { type: String },
    branchName: { type: String },
    accountHolder: { type: String },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number },
    otpExpiry: { type: Date },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }, 
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },

    address: [
      {
        h_no: { type: String },
        nearby: { type: String },
        district: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: String },
        country: { type: String },
      },
    ],
    notifications: [{ type: Schema.Types.ObjectId, ref: "notifications" }],
    firmIndustry: {
      type: String,
      enum: ["trader", "manufacturer", "service"],
    },
    firmSubIndustry: {
      type: String,
    },

    registeredTaxationDetail: [
      {
        fieldName: { type: String },
        fieldValue: { type: String },
        toShow: { type: Boolean, default: true },
      },
    ],
    firmDetails: {
      type: new Schema(
        {
          firmType: {
            type: String,
            enum: [
              "sole_proprietorship",
              "partnership",
              "llp",
              "llc",
              "pvt_ltd",
              "public_ltd",
              "opc",
              "huf",
              "cooperative",
              "corporation",
              "section_8",
              "joint_venture",
            ],
            required: true,
          },
          pan: { type: String },
          gstin: { type: String },
          udyam: { type: String },
          currentBankAccount: { type: String },
          shopAndEstablishmentLicense: { type: String },
          certificateOfIncorporation: { type: String },
          partnershipDeed: { type: String },
          llpAgreement: { type: String },
          moaAndAoa: { type: String },
          tan: { type: String },
          digitalSignatureCertificate: { type: String },
          din: { type: String },
          esiAndPfRegistration: { type: String },
          cin: { type: String },
          sebiRegistration: { type: String },
          hufPan: { type: String },
          registrationCertificate: { type: String },
          "12aAnd80gRegistration": { type: String },
          jvAgreement: { type: String },
          otherBusinessSpecificLicenses: { type: String },
        },
        { _id: false }
      ),
    },
    bankDetails: [
      {
        country: {
          type: String,
          enum: ["India", "UAE", "Saudi Arabia", "Malaysia"],
          required: true,
        },

        // Common Fields
        bankName: { type: String },
        accountHolder: { type: String },
        accountNumber: { type: String },
        branchName: { type: String },

        // India-Specific Fields
        ifscCode: { type: String },
        cifNumber: { type: String },
        gstin: { type: String },
        panNumber: { type: String },
        udyamNumber: { type: String },

        // UAE-Specific Fields
        iban: { type: String },
        swiftCode: { type: String },
        vatRegistrationNumber: { type: String },
        tradeLicenseNumber: { type: String },

        // Saudi Arabia-Specific Fields
        commercialRegistrationNumber: { type: String },

        // Malaysia-Specific Fields
        taxRegistrationNumber: { type: String },
        ssmRegistrationNumber: { type: String },
      },
    ],

    invoiceLayout: {
      type: String,
      enum: ['layout1', 'layout2', 'layout3'],
      default: 'layout1'
    },
    billLayout: {
      type: String,
      enum: ['layout1', 'layout2', 'layout3'],
      default: 'layout1'
    },
    firmAccess: [
      {
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        departmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
          default: null
        },

        designationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Designation",
          default: null
        },

        isActive: {
          type: Boolean,
          default: true
        }
      }
    ],

    smtpSettings: { type: SmtpSettingsSchema, default: {} },
  },
  

  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
