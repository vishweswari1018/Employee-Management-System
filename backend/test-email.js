require('dotenv').config();
const { sendOtpEmail } = require('./utils/emailService');

(async () => {
  console.log("Testing email with:");
  console.log("User:", process.env.EMAIL_USER);
  console.log("Pass:", process.env.EMAIL_PASS ? "********" : "NOT SET");
  
  const success = await sendOtpEmail(process.env.EMAIL_USER || "test@test.com", "123456");
  console.log("Success:", success);
  process.exit(0);
})();
