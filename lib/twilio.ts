import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

if (!accountSid || !authToken || !serviceSid) {
  console.warn("Twilio credentials are not fully configured in environment variables.");
}

const client = twilio(accountSid, authToken);

// OTP BHEJNA — SMS ya WhatsApp
// channel = 'sms' ya 'whatsapp'
export async function sendOTP(phoneNumber: string, channel: "sms" | "whatsapp" = "sms") {
  if (!serviceSid) throw new Error("TWILIO_SERVICE_SID is missing");
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,      // E.164 format: +919876543210
        channel: channel      // 'sms' ya 'whatsapp'
      });
    return verification.status; // 'pending' aayega agar success
  } catch (error: any) {
    console.error("Twilio sendOTP error:", error.message);
    throw new Error(error.message); // This will pass the Twilio message to route.ts
  }
}

// OTP VERIFY KARNA
export async function verifyOTP(phoneNumber: string, code: string) {
  if (!serviceSid) throw new Error("TWILIO_SERVICE_SID is missing");
  try {
    const result = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code            // User ne jo code dala
      });
    return result.status; // 'approved' aayega agar sahi code
  } catch (error: any) {
    console.error("Twilio verifyOTP error:", error.message);
    return "failed"; // This will trigger the "Invalid or expired OTP" error in route.ts
  }
}
