const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

module.exports.sendEmail = async (options) => {
  //transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    service: process.env.EMAIL_SERVICE, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const { data, email, tamplate, subject } = options;
  const tamplatePath = path.join(__dirname, "../mails", tamplate);
  const html = await ejs.renderFile(tamplatePath, data);

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
