// controllers/smsController.js
import { sendSMS } from "../services/smsService.js";

export const sendSMSController = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "email number and message required" });
    }

    const result = await sendSMS(email, message);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
