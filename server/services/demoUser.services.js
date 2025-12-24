const DemoUserEntry = require("../schemas/demoUserEntry.schema");
const crypto = require("crypto");
const PasswordService = require('./password.services');
const jwt = require("jsonwebtoken");
const  {sendDemoCredentialsMail}  = require("../utils/mailer");
const User =  require("../schemas/user.schema")
const DemoUserService = {};

DemoUserService.createDemoUser = async (body) => {
  const { firstName, lastName, email, mobileSecondary } = body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("A user with this email already exists.");

  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  const demoPassword = `Demo@${randomDigits}`;

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const tokenPayload = {
    email,
    mobile: mobileSecondary?.number,
    isDemo: true,
  };
  const encryptedToken = jwt.sign(tokenPayload, process.env.TOKEN_KEY, {
    expiresIn: "24h",
  });

  const demoUser = await User.create({
    firstName,
    lastName,
    email,
    password: await PasswordService.passwordHash(demoPassword),
    mobileSecondary: {
      countryCode: mobileSecondary?.countryCode,
      number: mobileSecondary?.number,
    },
    isDemo: true,
    role: "client_admin",
    token: encryptedToken,
    expiresAt,
    isVerified: true,
    isActive: true,
    salesTracker: true,
  });

  await sendDemoCredentialsMail(email, firstName, demoPassword, process.env.FRONTEND_DEMO_LOGIN);

  return demoUser;
};

// const loginLink = `${process.env.FRONTEND_URL}/demo/login?email=${encodeURIComponent(
//   email
// )}&token=${encodeURIComponent(encryptedToken)}`;


DemoUserService.logDemoActivity = async (userId, route, action) => {
  await DemoUserEntry.findByIdAndUpdate(
    userId,
    { $push: { activityLogs: { route, action } } },
    { new: true }
  );
};

module.exports = DemoUserService;
