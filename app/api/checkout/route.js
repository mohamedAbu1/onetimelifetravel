import { NextResponse } from "next/server";
import { getAuthenticatedUser, unauthorized } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return unauthorized();
    const { amount, userDetails } = await request.json();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 10_000_000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!process.env.PAYMOB_API_KEY || !process.env.PAYMOB_INTEGRATION_ID) {
      console.error("❌ Missing Paymob Environment Variables");
      return NextResponse.json(
        { error: "Server configuration missing variables" },
        { status: 500 },
      );
    }

    // 1. Auth Request
    const authResponse = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });
    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.token) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      );
    }

    const authToken = authData.token;

    // 2. Order Registration
    const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: Math.round(numericAmount * 100),
        currency: "EGP",
        items: [],
      }),
    });
    const orderData = await orderResponse.json();

    if (!orderResponse.ok || !orderData.id) {
      return NextResponse.json(
        { error: "Order registration failed" },
        { status: 400 },
      );
    }

    const orderId = orderData.id;

    // 3. Payment Key Request
    const paymentKeyResponse = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(numericAmount * 100),
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: userDetails?.email || "customer@example.com",
          floor: "NA",
          first_name: userDetails?.firstName || "Guest",
          street: "NA",
          building: "NA",
          phone_number: userDetails?.phone || "+201000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: userDetails?.lastName || "User",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
        lock_order_when_paid: "true",
      }),
    });
    const paymentKeyData = await paymentKeyResponse.json();

    if (!paymentKeyResponse.ok || !paymentKeyData.token) {
      return NextResponse.json(
        { error: "Payment key generation failed" },
        { status: 400 },
      );
    }
    return NextResponse.json({ token: paymentKeyData.token });
  } catch (error) {
    console.error("💥 Paymob Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

