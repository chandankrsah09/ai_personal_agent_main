import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/twilio";

export async function POST(request: Request) {
  try {
    const { phoneNumber, method } = await request.json() as {
      phoneNumber: string;
      method: "sms" | "whatsapp";
    };

    let formattedPhone = phoneNumber?.trim() || "";
    if (formattedPhone && !formattedPhone.startsWith("+")) {
      formattedPhone = "+91" + formattedPhone;
    }

    if (!formattedPhone || !method) {
      return NextResponse.json(
        { error: "Phone number and method are required" },
        { status: 400 }
      );
    }

    if (!["sms", "whatsapp"].includes(method)) {
      return NextResponse.json(
        { error: "Method must be 'sms' or 'whatsapp'" },
        { status: 400 }
      );
    }

    const status = await sendOTP(formattedPhone, method);

    return NextResponse.json({
      success: true,
      message: `OTP sent via ${method === "whatsapp" ? "WhatsApp" : "SMS"}`,
      status, // 'pending' if successful
    });
  } catch (error: unknown) {
    console.error("Error sending OTP:", error);
    const message = error instanceof Error ? error.message : "Failed to send OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
