// controllers/smsController.js
import { sendSMS } from "../services/smsService.js";

export const sendSMSController = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: "Phone number and message required" });
    }

    const result = await sendSMS(phone, message);
    res.status(200).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
