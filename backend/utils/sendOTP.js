import axios from "axios";

export const sendOTP = async (email, otp) => {
  // DEV: fallback to console for local/dev
  console.log(`DEV OTP -> ${email}: ${otp}`);

  // PRODUCTION: uncomment & configure provider (Fast2SMS example)
  /*
  await axios.post("https://www.fast2sms.com/dev/bulkV2", {
    route: "otp",
    numbers: email,
    variables_values: otp,
    // template_id: "YOUR_TEMPLATE_ID_IF_REQUIRED"
  }, {
    headers: { authorization: process.env.FAST2SMS_API_KEY }
  });
  */
};
