const nodemailer = require("nodemailer");
const generateTemporaryPassword = require("../utils/tempPassword");
const PasswordService = require("./password.services");
const User = require("../schemas/user.schema");
const multer = require("multer");
const uploadToCloudinary = require("../utils/cloudinary");
const Plan = require("../schemas/plans.schema");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const DemoUserEntry = require("../schemas/demoUserEntry.schema");
const DemoUserLogs = require("../schemas/demoUserLogs.schema");

const { sendCredentialsEmail, generateOtp } = require("../utils/mailer");
const Payment = require("../schemas/payment.schema");
const { validateUserSubscription } = require("../helpers/validateSubscription");

const authService = {};

// REGISTER
authService.Registration = async (body) => {
  try {
    const existingUser = await User.findOne({
      email: body.email,
    });
    // if (existingUser) {
    //   return Promise.reject("Account already exists!");
    // }
    if (existingUser) throw new Error("Account already exists!");

    // if (!body.planId) {
    //   return Promise.reject("Plan ID is required.");
    // }
    if (!body.planId) throw new Error("Plan ID is required.");

    const plan = await Plan.findById(body.planId);
    // if (!plan) {
    //   return Promise.reject("Invalid Plan ID. Please select a valid plan.");
    // }
    if(!plan) throw new Error("Invalid Plan ID. Please select a valid plan.");

    const hashedPassword = await PasswordService.passwordHash(body.password);
    body.password = hashedPassword;
    body.role = body.role || "client_admin";
    if (!body.adminId) {
      const superAdmin = await User.findOne({
        role: "super_admin",
      });
      if (!superAdmin) {
        return Promise.reject("Super Admin not found.");
      }
      body.adminId = superAdmin._id;
    }
    const user = await User.create(body);

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Send OTP via email
    await generateOtp({
      email: user.email,
      otp,
    });

    return user;
  } catch (error) {
    console.error("Error during Registration:", error);
    return Promise.reject("Unable to create user");
  }
};

// VERFIY LOGIN
authService.verifyOtp = async (body) => {
  const { email, otp } = body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("User Not Exist");
  }

  if (user.otp !== Number(otp)) {
    throw new Error("Invalid OTP");
  }

  const currentTime = new Date();
  if (currentTime > user.otpExpiry) {
    throw new Error("OTP has expired");
  }

  // OTP is valid, mark the user as verified
  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  return "OTP verified successfully";
};

authService.createDemoUser = async (body) => {
  try {
    const hashedPassword = await bcrypt.hash("Demo@123", 10);

    const demoUser = new User({
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com", // ⚠️ make unique if calling multiple times
      password: hashedPassword,
      role: "client_admin",
      isDemo: true,
      isVerified: true,
      isActive: true,
    });

    await demoUser.save();
    console.log("Demo user created:", demoUser);

    return demoUser; // ✅ return user so controller gets it
  } catch (error) {
    console.error("Error creating demo user:", error);
    throw new Error("Unable to create demo user");
  }
};

// RESEND OTP
authService.resendOtp = async (body) => {
  const user = await User.findOne({
    email: body.email,
  });

  if (!user) {
    throw new Error("User Not Exist");
  }

  const currentTime = new Date();
  if (currentTime < user.otpExpiry) {
    throw new Error("Existing OTP is still valid. Please wait.");
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000);
  user.otp = newOtp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  // Send new OTP
  await generateOtp({
    email: user.email,
    otp: newOtp,
  });

  return {
    message: "New OTP sent successfully",
  };
};

// LOGIN USER
// authService.userLogin = async (body) => {
//     try {
//         const { email, password } = body;
//         const user = await User.findOne({ email: email });
//         if (!user) {
//             throw new Error('Account Not Found');
//         }

//         const passwordMatch = await PasswordService.comparePassword(password, user.password);
//         if (!passwordMatch) {
//             throw new Error("Incorrect Password");
//         }

//         if (user.role === "client_admin"){
//             if(user.isVerified === false){
//                 throw new Error("Please verify your account");
//             }
//             if (user.isActive === false) {
//                 throw new Error("Your account is pending approval. Please contact the administrator or wait until its approved.");
//             }
//             const latestPayment = await Payment.findOne({ userId: user._id, status: 'completed' }).sort({ paymentDate: -1 });
//             if (!latestPayment) {
//                 throw new Error("No active subscription found. Please purchase a plan to continue.");
//             }
//             if (new Date() > new Date(latestPayment.expirationDate)) {
//                 user.isActive = false;
//                 await user.save();
//                 throw new Error("Your subscription has expired. Please renew your plan.");
//             }
//         }
//         if(user.role === "firm_admin" || user.role === "accountant" || user.role === "employee"){
//             if(user.isActive === false){
//                 throw new Error("Your account is inactive");
//             }
//         }
//         // Return user data without password
//         return await User.findOne({ _id: user._id }).select("-password");

//     } catch (error) {
//         console.error('Login failed:', error);
//         throw new Error(error.message || 'Login failed');
//     }
// };

authService.userLogin = async (body) => {
  try {
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Account not found");

    const passwordMatch = await PasswordService.comparePassword(
      password,
      user.password
    );
    if (!passwordMatch) throw new Error("Incorrect password");

    if (user.isDemo) {
      if (user.expiresAt && new Date() > new Date(user.expiresAt)) {
        throw new Error(
          "Your demo access has expired. Please request a new demo account."
        );
      }

      return {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isDemo: true,
        token: user.token,
        expiresAt: user.expiresAt,
      };
    }

    // const passwordMatch = await PasswordService.comparePassword(password, user.password);
    // console.log(passwordMatch)
    // if (!passwordMatch) throw new Error("Incorrect password");

    if (user.role === "super_admin" || user.role === "blog_admin") {
      const data = user.toObject();
      delete data.password;
      return data;
    }


    let clientAdmin;
    if (["firm_admin", "employee", "accountant"].includes(user.role)) {
      //   const firmAdmin = await User.findOne({ _id: user.adminId });
      //   if (!firmAdmin || firmAdmin.isDeleted) {
      //     throw new Error("Your firm is deleted. Please contact your administrator.");
      //   }

      //   const firm = await User.findOne({ _id: user.adminId });
      //   if (!firm) {
      //     throw new Error("Firm not found for the user");
      //   }
      const firmrecord = await User.findOne({ _id: user.adminId });

      const firmAdmin = firmrecord;
      if (!firmAdmin) {
        throw new Error("Firm Admin not found for the user");
      }
      const firm = firmrecord;
      if (!firm) {
        throw new Error("Firm not found for the user");
      }

      clientAdmin = await User.findOne({
        _id: firm.adminId,
        role: "client_admin",
      });

      if (!clientAdmin) {
        throw new Error("Client Admin not found for the firm");
      }
    } else if (user.role === "client_admin") {
      clientAdmin = user;
    }

    if (!clientAdmin) throw new Error("Associated Client Admin not found");

    if (!user.isDemo) {
      const subscriptionStatus = await validateUserSubscription(
        clientAdmin,
        user.role
      );
      if (subscriptionStatus.redirectTo) {
        return {
          loginFailed: true,
          error: {
            message: subscriptionStatus.message,
            redirectTo: subscriptionStatus.redirectTo,
          },
        };
      }
    }

    if (user.role === "client_admin") {
      if (!user.isVerified) throw new Error("Please verify your account");
      if (!user.isActive)
        throw new Error(
          "Your account is pending approval. Please contact the administrator."
        );
    } else if (["firm_admin", "accountant", "employee"].includes(user.role)) {
      if (!user.isActive) throw new Error("Your account is inactive");
    }

    return await User.findOne({ _id: user._id }).select("-password");
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(error.message || "Login failed");
  }
};

authService.UserForgetPassword = async (body) => {
  const { email } = body;
  try {
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return Promise.reject("Account Not Found");
    }

    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await PasswordService.passwordHash(
      temporaryPassword
    );
    await User.updateOne(
      {
        email: email,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_MAIL,
        pass: process.env.GOOGLE_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GOOGLE_MAIL,
      to: email,
      subject: "Password Reset",
      text: `Your temporary password is: ${temporaryPassword}. Please use this password to login and reset your password immediately. https://aamobee.com/reset-password/${temporaryPassword}`,
    };
    await transporter.sendMail(mailOptions);
    return "Temporary password sent to your email.";
  } catch (error) {
    console.error("Error during password reset:", error.message);
    return Promise.reject("An error occurred while processing the request.");
  }
};

authService.resetPassword = async (body) => {
  try {
    const { email, temporaryPassword, newPassword } = body;

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return Promise.reject("Account Not Found");
    } else {
      const match = await PasswordService.comparePassword(
        temporaryPassword,
        user.password
      );
      if (match) {
        const updatedPassword = await PasswordService.passwordHash(newPassword);
        user.password = updatedPassword;
        await user.save();
        return "Password Updated Successfully";
      } else {
        return Promise.reject("Invalid Temporary Password");
      }
    }
  } catch (error) {
    console.error(error);
    return Promise.reject("An error occurred while processing the request.");
  }
};

// GET ACCOUNT
authService.getAccount = async (id) => {
  try {
    const data = await User.findOne({
      _id: id,
    }).select("-password");
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject("Error occured during fetching the company data.");
  }
};

// CREATE FIRM OR CREATE USER
// authService.registration = async (id, data) => {
//     try {
//         const firm = await User.findOne({_id:id}).populate({
//             path: 'adminId',
//             populate: {
//                 path: 'planId'
//             }
//         })
//         console.log(firm,"firmsss")
//         const clientAdmin = firm.adminId;
//         if (!clientAdmin) {
//             console.log("Client Admin not found for this firm.");
//             return Promise.reject("Client Admin not found for this firm.");
//         }

//         const clientPlan = clientAdmin.planId;
//         if (!clientPlan) {
//             console.log("Client admin does not have a valid plan.");
//             return Promise.reject("Client admin does not have a valid plan.");
//         }
//         const countUser = await User.countDocuments({ adminId: id})
//         if(countUser > clientPlan.maxUsers){
//             return Promise.reject("User creation limit reached for this plan. Please upgrade.");
//         }
//         console.log(countUser, "countuser")
//         const existingUser = await User.findOne({ email: data.email });
//         if (existingUser) {
//             return Promise.reject("Account already exists!");
//         }

//         if (data.role === 'firm_admin') {
//             const existingFirmAdmin = await User.findOne({ role: 'firm_admin', adminId: id });
//             if (existingFirmAdmin) {
//                 return Promise.reject("There is already a firm admin for this firm!");
//             }
//         }

//         console.log(data, "dataa")
//         if (data.avatar) {
//             let imageUrl;
//             if (typeof data.avatar === 'string' && data.avatar.startsWith('http')) {
//                 imageUrl = data.avatar;
//             } else if (typeof data.avatar === 'string' && data.avatar.startsWith('data:image')) {
//                 const base64Data = data.avatar.replace(/^data:image\/\w+;base64,/, "");
//                 const buffer = Buffer.from(base64Data, 'base64');
//                 const uploadResponse = await uploadToCloudinary(buffer);
//                 imageUrl = uploadResponse.secure_url;
//             } else if (Buffer.isBuffer(data.avatar)) {
//                 const uploadResponse = await uploadToCloudinary(data.avatar);
//                 imageUrl = uploadResponse.secure_url;
//             } else {
//                 throw new Error("Invalid avatar format");
//             }

//             data.avatar = imageUrl;
//         } else {
//             console.log("No file uploaded.");
//         }
//         const encryptedPassword = await PasswordService.passwordHash(data.password);
//         data.password = encryptedPassword;
//         data.isActive = true;
//         data.adminId = id;

//        const newUser = new User(data);
//        const user = await newUser.save();
//        return user;
//     } catch (error) {
//       console.error("Error in user registration:", error);
//       return Promise.reject("Unable to create User");
//     }
// }

// authService.registration = async (id, data) => {
//     const existingUser = await User.findOne({ email: data.email });
//     if (existingUser) {
//         throw new Error("Account already exists!");
//     }

//     if (data.role === 'firm_admin') {
//         const existingFirmAdmin = await User.findOne({ role: 'firm_admin', adminId: id });
//         if (existingFirmAdmin) {
//             throw new Error("There is already a firm admin for this firm!");
//         }
//     }

//     const encryptedPassword = await PasswordService.passwordHash(data.password);
//     data.password = encryptedPassword;
//     console.log('Registration Data:', data.password); // Log the data
//     data.isActive = true;
//     data.adminId = id;

//     const newUser = new User(data);
//     const user = await newUser.save();
//     return user;
// };
authService.registration = async (id, data) => {
  // Check if the user already exists
  const existingUser = await User.findOne({
    email: data.email,
  });
  if (existingUser) {
    throw new Error("Account already exists!");
  }

  // Check if a firm admin already exists for this firm
  if (data.role === "firm_admin") {
    const existingFirmAdmin = await User.findOne({
      role: "firm_admin",
      adminId: id,
    });
    if (existingFirmAdmin) {
      throw new Error("There is already a firm admin for this firm!");
    }
  }

  if (
    data.avatar &&
    typeof data.avatar === "string" &&
    data.avatar.startsWith("http")
  ) {
    data.avatar = data.avatar;
  } else if (data.avatar && Buffer.isBuffer(data.avatar)) {
    const uploadResponse = await uploadToCloudinary(data.avatar);
    data.avatar = uploadResponse.secure_url;
  } else if (data.avatar && data.avatar instanceof File) {
    const fileBuffer = Buffer.from(await data.avatar.arrayBuffer());
    const uploadResponse = await uploadToCloudinary(fileBuffer);
    data.avatar = uploadResponse.secure_url;
  } else if (data.avatar) {
    throw new Error("Invalid avatar format");
  }
  const temporaryPassword = crypto.randomBytes(6).toString("hex");
  // Encrypt the password
  const encryptedPassword = await PasswordService.passwordHash(
    temporaryPassword
  );
  data.password = encryptedPassword;

  data.isActive = true;
  data.adminId = id;

  // Save the new user in the database
  const newUser = new User(data);
  const user = await newUser.save();
  await sendCredentialsEmail(
    user.email,
    temporaryPassword,
    "https://aamobee.com/login"
  );
  return user;
};

// UPDATE PASSWORD
authService.updatePassword = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  const isPasswordValid = await PasswordService.comparePassword(
    data.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new Error("Current Password Doesn't Match");
  }
  const newPassword = await PasswordService.passwordHash(data.newPassword);
  user.password = newPassword;
  await user.save();
  return user;
};

// Approved ClientAdmin through SuperAdmin
authService.approveClientAdmin = async (userId, body) => {
  const { status } = body;
  const user = await User.findById(userId).populate("planId");
  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== "client_admin") {
    throw new Error("Only client admin accounts can be approved.");
  }

  // Check if already active
  if (user.isActive) {
    throw new Error("Account is already active.");
  }

  // Calculate expiration date based on plan
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + user.planId.days);

  const payment = new Payment({
    userId: user._id,
    planId: user.planId._id,
    amount: user.planId.price,
    status: "completed",
    expirationDate: expirationDate,
  });
  await payment.save();
  user.isActive = status;
  await user.save();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_MAIL,
      pass: process.env.GOOGLE_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GOOGLE_MAIL,
    to: user.email,
    subject: "Approval Notification",
    text: `Dear ${user.firstName},\n\nYour account and payment have been approved. You can now log in to your account using the following link: https://aamobee.com/login\n\nThank you for choosing our service.\n\nBest regards,\nAamobee Team`,
  };

  await transporter.sendMail(mailOptions);
  return user;
};

// USER INACTIVE
authService.userInactive = async (id, body) => {
  const { isActive } = body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("User not found");
  }
  user.isActive = isActive;
  await user.save();
  return user;
};

// GET FIRMS
authService.getCompany = async (id) => {
  try {
    const data = await User.find({
      adminId: id,
      isDeleted: false,
    })
      .select("-password")
      .populate("adminId")
      .sort({ createdAt: 1 }); 
    const populatedData = await Promise.all(
      data.map(async (user) => {
        if (user.role === "client_admin") {
          return await User.findById(user._id)
            .select("-password")
            .populate("adminId")
            .populate("planId");
        }
        return user;
      })
    );
    return populatedData;
  } catch (error) {
    console.error(error);
    return Promise.reject("Error occured during fetching the company data.");
  }
};
authService.getfirm = async (id) => {
  try {
    const data = User.find({
      _id: id,
    });
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject("Error occured during fetching the company data.");
  }
};

// update account
// authService.updateAccount = async (id, req) => {
//     try {
//         const data = req.body;

//         await new Promise((resolve, reject) => {
//             upload.single('avatar')(req, null, (err) => {
//                 if (err instanceof multer.MulterError) {
//                     return reject(new Error('File upload error: ' + err.message));
//                 } else if (err) {
//                     return reject(new Error('File validation error: ' + err.message));
//                 }
//                 resolve();
//             });
//         });

//         if (req.file) {
//             // Upload the profile picture to Cloudinary
//             const imageUrl = await uploadToCloudinary(req.file.buffer);
//             data.avatar = imageUrl;
//         } else {
//             console.log("No file uploaded.");
//         }

//         const updatedAccount = await User.findOneAndUpdate({ _id: id }, data, { new: true });
//         return updatedAccount;
//     } catch (error) {
//         console.log("Error in updating account", error);
//         return Promise.reject("Unable to update account. Try again later!");
//     }
// }

authService.updateAccount = async (id, data) => {
  try {
    if (data.avatar) {
      let imageUrl;
      if (typeof data.avatar === "string" && data.avatar.startsWith("http")) {
        imageUrl = data.avatar;
      } else if (
        typeof data.avatar === "string" &&
        data.avatar.startsWith("data:image")
      ) {
        const base64Data = data.avatar.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const uploadResponse = await uploadToCloudinary(buffer);
        imageUrl = uploadResponse.secure_url;
      } else if (Buffer.isBuffer(data.avatar)) {
        const uploadResponse = await uploadToCloudinary(data.avatar);
        imageUrl = uploadResponse.secure_url;
      } else {
        throw new Error("Invalid avatar format");
      }

      data.avatar = imageUrl;
    } else {
      console.log("No file uploaded.");
    }

    const updatedAccount = await User.findOneAndUpdate(
      {
        _id: id,
      },
      data,
      {
        new: true,
      }
    );
    return updatedAccount;
  } catch (error) {
    console.log("Error in updating account", error);
    return Promise.reject("Unable to update account. Try again later!");
  }
};

// COUNT CLIENT ADMIN
authService.countUsers = async (body) => {
  try {
    const { role, userId } = body;

    if (!role || !userId) {
      return Promise.reject("Role and User ID are required");
    }

    if (role === "super_admin") {
      const clientAdmins = await User.countDocuments({
        adminId: userId,
      });
      return {
        message: "Client Admins under Super Admin",
        data: clientAdmins,
      };
    }

    if (role === "client_admin") {
      const firms = await User.countDocuments({
        adminId: userId,
      });
      return {
        message: "Firms under Client Admin",
        data: firms,
      };
    }

    if (role === "firm") {
      const users = await User.countDocuments({
        adminId: userId,
      });
      return {
        message: "Users under Firm Admin",
        data: users,
      };
    }

    if (role === "firm_admin" || role === "accountant" || role === "employee") {
      const user = await User.findOne({
        _id: userId,
      });
      if (user) {
        const users = await User.countDocuments({
          adminId: user.adminId,
        });
        return {
          message: "Users under Firm Admin",
          data: users,
        };
      }
    }

    return Promise.reject(
      "Invalid role provided. Use 'super_admin', 'client_admin', 'firm' or 'firm_admin'"
    );
  } catch (error) {
    console.log("Error in fetching child entities", error);
    return Promise.reject("Unable to fetch child entities. Try again later!");
  }
};

// Firms Under Client Admin
authService.getFirmUnderClient = async () => {
  try {
    const clientAdmins = await User.find({
      role: "client_admin",
    }).select("-password -otp");
    if (!clientAdmins) {
      return res.status(404).json({
        message: "Client Admin not found",
      });
    }
    const response = [];
    await Promise.all(
      clientAdmins.map(async (admin) => {
        const firms = await User.find({
          adminId: admin._id,
        }).select("-password -otp");
        response.push({
          ...admin.toObject(),
          firms: firms,
        });
      })
    );
    return response;
  } catch (error) {
    console.log("Error Getting Firms under clientaccount", error);
    return Promise.reject(
      "Error Getting Firms under clientaccount. Try again later!"
    );
  }
};

// crud for user permissions of the sidebar .
authService.setPermissionsForUser = async (userId, sidebarAccess) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.sidebarAccess = sidebarAccess;
  await user.save();

  return user;
};

authService.getSidebarForUser = async (userId) => {
  const user = await User.findById(userId).select("sidebarAccess");
  if (!user) throw new Error("User not found");

  const sortedSidebar = (user.sidebarAccess || [])
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => ({
      ...item.toObject(),
      subItem: (item.subItem || []).sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      ),
    }));

  return sortedSidebar;
};

authService.updateUserPermissions = async (userId, sidebarAccess) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.sidebarAccess = sidebarAccess;
  await user.save();

  return user.sidebarAccess;
};

// authService.js
authService.deleteFirmCascade = async (firmId) => {
  try {
    // 1. Validate the firm user exists with role "firm"
    const firmUser = await User.findOne({
      _id: firmId,
      role: "firm",
    });

    if (!firmUser) {
      return {
        success: false,
        message: "Firm not found.",
      };
    }

    // 2. Soft delete only the firm
    await User.findByIdAndUpdate(firmId, {
      $set: {
        isActive: false,
        isDeleted: true,
      },
    });

    return {
      success: true,
      message: "Firm soft deleted successfully.",
    };
  } catch (error) {
    console.error("Error in deleteFirmOnly:", error);
    throw error;
  }}
authService.changePassword = async (id, newPassword) => {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");

  const hashedPassword = await PasswordService.passwordHash(newPassword);
  user.password = hashedPassword;
  await user.save();

  return { success: true, userId: user._id };
};

authService.getDemoUser = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const demoUsers = await User.find({ salesTracker: true, isDemo: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalDemoUsers = await User.countDocuments({
      salesTracker: true,
      isDemo: true,
    });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      isDemo: true,
      salesTracker: true,
    });
    const inactiveUsers = await User.countDocuments({
      isDemo: false,
      salesTracker: false,
    });
    const totalPages = Math.ceil(totalDemoUsers / limit);

    return {
      demoUsers,
      pagination: { currentPage: page, totalPages, pageSize: limit },
      totalUsers,
      totalDemoUsers,
      activeUsers,
      inactiveUsers,
    };
  } catch (error) {
    console.error("Error fetching demo user data:", error);
    throw new Error("Unable to fetch demo user data");
  }
};

authService.getAllDemoUserLogs = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;

    const logs = await DemoUserLogs.find()
      .populate("demoUserId", "firstName lastName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalLogs = await DemoUserLogs.countDocuments();
    const totalPages = Math.ceil(totalLogs / limit);

    return {
      logs,
      pagination: { currentPage: page, totalPages, pageSize: limit },
      totalLogs,
    };
  } catch (error) {
    console.error("Error in getAllDemoUserLogs service:", error);
    throw new Error("Unable to fetch all demo user logs");
  }
};

authService.getDemoUserLogsById = async (demoUserId) => {
  try {
    const demoLogs = await DemoUserLogs.findOne({ demoUserId }).populate(
      "demoUserId",
      "firstName lastName email"
    );

    return demoLogs;
  } catch (error) {
    console.error("Error in getDemoUserLogsById service:", error);
    throw new Error("Unable to fetch demo user logs by ID");
  }
};

// authService.updateDemoUserExpiryService = async ({ userId, operation, time }) => {
//   if (!userId || !operation || !time) {
//     throw new Error("userId, operation and time are required");
//   }

//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   let expiry = user.expiresAt ? new Date(user.expiresAt) : new Date();

//   const { seconds = 0, minutes = 0, hours = 0, days = 0, months = 0 } = time;
//   let deltaMs = 0;
//   deltaMs += seconds * 1000;
//   deltaMs += minutes * 60 * 1000;
//   deltaMs += hours * 60 * 60 * 1000;
//   deltaMs += days * 24 * 60 * 60 * 1000;
//   deltaMs += months * 30 * 24 * 60 * 60 * 1000;

//   if (operation === "increase") {
//     expiry = new Date(expiry.getTime() + deltaMs);
//   } else if (operation === "decrease") {
//     expiry = new Date(expiry.getTime() - deltaMs);
//   } else {
//     throw new Error("Invalid operation. Must be 'increase' or 'decrease'");
//   }

//   user.expiresAt = expiry;
//   await user.save();

//   return user;
// };
authService.updateDemoUserExpiryService = async ({
  userId,
  operation,
  time,
}) => {
  if (!userId || !operation || !time) {
    throw new Error("userId, operation and time are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let expiry =
    user.expiresAt && user.expiresAt > new Date()
      ? new Date(user.expiresAt)
      : new Date();

  const { seconds = 0, minutes = 0, hours = 0, days = 0, months = 0 } = time;
  let deltaMs = 0;
  deltaMs += seconds * 1000;
  deltaMs += minutes * 60 * 1000;
  deltaMs += hours * 60 * 60 * 1000;
  deltaMs += days * 24 * 60 * 60 * 1000;
  deltaMs += months * 30 * 24 * 60 * 60 * 1000;

  if (operation === "increase") {
    expiry = new Date(expiry.getTime() + deltaMs);
  } else if (operation === "decrease") {
    expiry = new Date(expiry.getTime() - deltaMs);
    if (expiry < new Date()) expiry = new Date();
  } else {
    throw new Error("Invalid operation. Must be 'increase' or 'decrease'");
  }

  user.expiresAt = expiry;
  await user.save();

  return user;
};

module.exports = authService;
