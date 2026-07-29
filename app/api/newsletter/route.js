import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to GOR MENSWEAR Private Atelier.",
      promoCode: "GORVIP",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Newsletter subscription failed" },
      { status: 500 }
    );
  }
}
