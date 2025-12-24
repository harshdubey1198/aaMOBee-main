const nodemailer = require("nodemailer");

function getTransporterAndFrom(firm = {}) {
  const smtp = firm.smtpSettings || {}; // expects { host, port, secure, user, pass, fromEmail, fromName }

  if (smtp.host && smtp.user && smtp.pass) {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: Number(smtp.port ?? 465),
      secure: smtp.secure ?? true, // true for 465, false for 587
      auth: { user: smtp.user, pass: smtp.pass },
    });

    const fromName = smtp.fromName || firm.companyTitle || 'aaMOBee';
    const fromEmail = smtp.fromEmail || smtp.user;
    return { transporter, from: `"${fromName}" <${fromEmail}>` };
  }

  // Fallback: your global Gmail account
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_MAIL,
      pass: process.env.GOOGLE_PASS,
    },
  });

  const fromName = firm.companyTitle || 'aaMOBee';
  const fromEmail = firm.email || process.env.GOOGLE_MAIL;
  return { transporter, from: `"${fromName}" <${fromEmail}>` };
}

// GENERATE OTP
const generateOtp = async (body) => {
    try {
        const {email, otp} = body

        const emailtemplate = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f0f0;
                            margin: 0;
                            padding: 0;
                        }
                        .title {
                            color: #FF4081;
                            font-weight: bold;
                            font-size: 24px;
                            margin-bottom: 10px;
                            font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: #fff0f5;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            color: #fff;
                        }
                        .otp-content {
                            background-color: #fff;
                            color: #071e43;
                            padding: 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                            border: 2px solid #FF4081;
                            text-align: left;
                        }
                        .logo {
                            max-height: 130px;
                            background: #fff0f5;
                        }
                        .otp-wrapper {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .otp {
                            font-size: xx-large;
                            text-align: center;
                            background-color: aquamarine;
                            padding: 5px 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img 
                            src="https://res.cloudinary.com/harshdubey1198/image/upload/v1726118056/aamobi_z8csyd.png"
                            alt="aaMOBee"
                            class="logo"
                        />
                        <h1 class="title">aaMOBee Account Verification</h1>
                        <div class="otp-content">
                            <p>Hello Guest!</p>
                            <p>Thank you for registering with aaMOBee! We're excited to have you on board.</p>
                            <p>To complete your registration and activate your account, please verify your email address using the One-Time Password (OTP) provided below:</p>
                            <p> Your OTP:</p>
                            <div class="otp-wrapper">
                                <p class="otp"> ${otp} </p>
                            </div>
                            <p>Please enter this OTP on the aaMOBee website to complete your verification.</p>
                            <p>If you did not create an account with aaMOBee, please ignore this email.</p>
                            <p>Thank you for choosing aaMOBee. If you have any questions or need assistance, feel free to contact our support team.</p>
                            <p>Best regards,</p>
                            <p>The aaMOBee Team</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GOOGLE_MAIL,
                pass: process.env.GOOGLE_PASS,
            },
        });
        // Define email content
        const mailOptions = {
            from: process.env.GOOGLE_MAIL,
            to: email,
            subject: "aaMOBee Account Verification",
            html: emailtemplate,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        return { message: "OTP sent successfully", otp: otp };

    } catch (error) {
        return Promise.reject("Error sending otp");
    }
}


// Function to send credentials via email
const sendCredentialsEmail = async (email, temporaryPassword, loginLink) => {
    try {
        const emailTemplate = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f0f0f0;
                            margin: 0;
                            padding: 0;
                        }
                        .title {
                            color: #FF4081;
                            font-weight: bold;
                            font-size: 24px;
                            margin-bottom: 10px;
                            font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
                        }
                        .container {
                            max-width: 600px;
                            margin: auto;
                            background: #fff0f5;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            text-align: center;
                            color: #fff;
                        }
                        .content {
                            background-color: #fff;
                            color: #071e43;
                            padding: 20px;
                            border-radius: 5px;
                            margin-top: 20px;
                            border: 2px solid #FF4081;
                            text-align: left;
                        }
                        .logo {
                            max-height: 130px;
                            background: #fff0f5;
                        }
                        .credential-wrapper {
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                        }
                        .login-link {
                            font-size: 16px;
                            color: #FF4081;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <img 
                            src="https://res.cloudinary.com/harshdubey1198/image/upload/v1726118056/aamobi_z8csyd.png"
                            alt="aaMOBee"
                            class="logo"
                        />
                        <h1 class="title">Welcome to aaMOBee!</h1>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Your account has been successfully created. Below are your login credentials:</p>
                            <div class="credential-wrapper">
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
                                <p><strong>Login Link:</strong> <a href="${loginLink}" class="login-link">${loginLink}</a></p>
                            </div>
                            <p>Please log in and change your password for security purposes.</p>
                            <p>If you have any questions, feel free to contact our support team.</p>
                            <p>Best regards,</p>
                            <p>The aaMOBee Team</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

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
            subject: "Welcome to aaMOBee - Account Credentials",
            html: emailTemplate,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Credentials sent to ${email}`);
    } catch (error) {
        console.error("Failed to send email:", error.message);
        throw new Error("Error sending credentials email");
    }
};

// query Response mail 

const queryResponse = async (email, name, subject) => {
    try {
      const emailTemplate = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
              }
              .title {
                color: #FF4081;
                font-weight: bold;
                font-size: 24px;
                margin-bottom: 10px;
                font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
              }
              .container {
                max-width: 600px;
                margin: auto;
                background: #fff0f5;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                text-align: center;
                color: #071e43;
              }
              .content {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                margin-top: 20px;
                border: 2px solid #FF4081;
                text-align: left;
              }
              .logo {
                max-height: 130px;
                background: #fff0f5;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img 
                src="https://res.cloudinary.com/harshdubey1198/image/upload/v1726118056/aamobi_z8csyd.png"
                alt="aaMOBee"
                class="logo"
              />
              <h1 class="title">Query Received Successfully!</h1>
              <div class="content">
                <p>Hello ${name || 'Guest'},</p>
                <p>Thank you for contacting <strong>aaMOBee</strong>.</p>
                <p>We have received your query regarding:</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p>Our support team will review your message and get back to you as soon as possible.</p>
                <p>Meanwhile, if you have urgent queries, feel free to reply to this email.</p>
                <p>Thank you for trusting us.</p>
                <p>Best regards,</p>
                <p>The aaMOBee Team</p>
              </div>
            </div>
          </body>
        </html>
      `;
  
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
        subject: "aaMOBee | Query Received Confirmation",
        html: emailTemplate,
      };
  
      await transporter.sendMail(mailOptions);
      console.log(`Query confirmation email sent to ${email}`);
    } catch (error) {
      console.error("Error sending query response email:", error.message);
      throw new Error("Failed to send query confirmation");
    }
  };

// NEW: email invoice with attached PDF (Buffer)
const sendInvoiceEmail = async ({ firm, to, invoice, pdfBuffer }) => {
  const { transporter, from } = getTransporterAndFrom(firm);

  const subject = `Invoice ${invoice?.invoiceNumber || invoice?._id} from ${firm?.companyTitle || 'aaMOBee'}`;
  const html = `
    <p>Hello ${invoice?.customer?.firstName || invoice?.customerName || ''},</p>
    <p>Please find attached your <strong>${invoice?.invoiceType || 'Invoice'}</strong> ${invoice?.invoiceSubType ? `(${invoice.invoiceSubType})` : ''}.</p>
    ${invoice?.dueDate ? `<p><strong>Due Date:</strong> ${invoice.dueDate}</p>` : ''}
    ${invoice?.notes ? `<p>${invoice.notes}</p>` : ''}
    <p>Thank you!</p>
  `;

  await transporter.sendMail({
    from,
    to,
    replyTo: firm?.email || from,
    subject,
    html,
    attachments: [
      {
        filename: `Invoice-${invoice?.invoiceNumber || invoice?._id}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
};
const sendDemoCredentialsMail = async (email, name, password) => {
  const loginLink = `${process.env.FRONTEND_URL}/login`;

  const emailTemplate = `
    <html>
      <head>
        <style>
          body { font-family: Arial; background: #f0f0f0; }
          .container {
            max-width: 600px; margin: auto; background: #fff0f5;
            padding: 20px; border-radius: 10px; text-align: center;
          }
          .content { background: #fff; padding: 20px; border-radius: 5px; border: 2px solid #FF4081; }
          a { color: #FF4081; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://res.cloudinary.com/harshdubey1198/image/upload/v1726118056/aamobi_z8csyd.png" alt="aaMOBee" height="100" />
          <h2>Welcome ${name},</h2>
          <div class="content">
            <p>You have been granted demo access to <strong>aaMOBee</strong>.</p>
            <p><strong>Your Demo Credentials:</strong></p>
            <p>Email: ${email}</p>
            <p>Password: ${password}</p>
            <p>Click here to log in: <a href="${loginLink}">${loginLink}</a></p>
            <p><strong>Note:</strong> Your access will expire in 24 hours.</p>
          </div>
        </div>
      </body>
    </html>`;

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
    subject: "aaMOBee Demo Credentials",
    html: emailTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Demo credentials sent to ${email}`);
};

// NEW: Send demo expiry notification (1 hour before expiry)
const sendDemoExpiryEmail = async (email, name, firm = {}) => {
  const { transporter, from } = getTransporterAndFrom(firm);

  const loginLink = `${process.env.FRONTEND_URL}/login`;

  const emailTemplate = `
    <html>
      <head>
        <style>
          body { font-family: Arial; background: #f0f0f0; }
          .container { max-width: 600px; margin: auto; background: #fff0f5; padding: 20px; border-radius: 10px; text-align: center; }
          .content { background: #fff; padding: 20px; border-radius: 5px; border: 2px solid #FF4081; }
          a { color: #FF4081; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://res.cloudinary.com/harshdubey1198/image/upload/v1726118056/aamobi_z8csyd.png" alt="aaMOBee" height="100" />
          <h2>Hello ${name},</h2>
          <div class="content">
            <p>Your <strong>demo plan</strong> is about to expire in <strong>1 hour</strong>.</p>
            <p>Please log in to continue using our service:</p>
            <p><a href="${loginLink}">${loginLink}</a></p>
           <p>Want to keep enjoying aaMOBee? Reply to this email to extend your demo and continue exploring without interruption!</p>
            <p>Thank you for using <strong>aaMOBee</strong>!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Your Demo Plan is Expiring Soon",
    html: emailTemplate,
  });

  console.log(`Demo expiry email sent to ${email}`);
};


const sendPlanExpiryReminder = async ({ email, name, planTitle, remaining }) => {
  const { transporter, from } = getTransporterAndFrom();

  const subject = `Your ${planTitle} plan expires in ${remaining}`;
  const html = `
    <html>
      <body style="font-family: Arial; background: #f0f0f0;">
        <div style="max-width:600px; margin:auto; background:#fff0f5; padding:20px; border-radius:10px; text-align:center;">
          <img src="https://res.cloudinary.com/harshdubey1198/image/upload/v1726118056/aamobi_z8csyd.png" height="100" />
          <h2>Hello ${name || "User"},</h2>
          <div style="background:#fff; border:2px solid #FF4081; border-radius:5px; padding:20px;">
            <p>Your <strong>${planTitle}</strong> plan is expiring in <strong>${remaining}</strong>.</p>
            <p>To avoid interruption, please renew your plan before expiry.</p>
            <p><a href="${process.env.FRONTEND_URL}/plans" style="color:#FF4081; text-decoration:none;">Renew Now</a></p>
            <p>Thank you for using <strong>aaMOBee</strong>.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({ from, to: email, subject, html });
  console.log(`📧 Sent ${remaining} expiry reminder to ${email}`);
};


// Export the function
module.exports = {
    sendCredentialsEmail,
    generateOtp,
    queryResponse,
    sendInvoiceEmail,
    sendDemoCredentialsMail,
    getTransporterAndFrom,
    sendDemoExpiryEmail,
    sendPlanExpiryReminder,
};
