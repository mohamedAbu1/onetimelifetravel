import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

const table = `
  CREATE TABLE IF NOT EXISTS car_bookings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    vehicle_type VARCHAR(64) NOT NULL,
    service_type VARCHAR(32) NOT NULL,
    passengers INT NOT NULL,
    luggage INT NOT NULL DEFAULT 0,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    flight_number VARCHAR(64) NULL,
    notes TEXT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_car_booking_user (user_id),
    INDEX idx_car_booking_status (status)
  )
`;

export async function POST(request) {
  try {
    const user = getAuthenticatedUser(request);
    if (!user) return unauthorized();

    const body = await request.json();
    const vehicleType = String(body.vehicleType || "").trim();
    const serviceType = String(body.serviceType || "").trim();
    const passengers = Number(body.passengers);
    const luggage = Number(body.luggage || 0);
    const pickupLocation = String(body.pickupLocation || "").trim();
    const dropoffLocation = String(body.dropoffLocation || "").trim();
    const pickupDate = String(body.pickupDate || "").trim();
    const pickupTime = String(body.pickupTime || "").trim();

    if (!vehicleType || !serviceType || !pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || !Number.isInteger(passengers) || passengers < 1 || passengers > 50 || !Number.isInteger(luggage) || luggage < 0 || luggage > 50) {
      return NextResponse.json({ error: "Please complete all required booking fields" }, { status: 400 });
    }

    const db = await connectDB();
    await db.query(table);
    const bookingId = uuidv4();
    await db.query(
      `INSERT INTO car_bookings (id, user_id, vehicle_type, service_type, passengers, luggage, pickup_location, dropoff_location, pickup_date, pickup_time, flight_number, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, user.id, vehicleType, serviceType, passengers, luggage, pickupLocation, dropoffLocation, pickupDate, pickupTime, String(body.flightNumber || "").trim() || null, String(body.notes || "").trim() || null],
    );

    await db.query(
      `INSERT INTO notifications (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, type, created_at, is_read)
       VALUES (?, ?, 'car_booking', ?, ?, ?, ?, ?, 'car_booking', NOW(), 0)`,
      [uuidv4(), user.id, `New car booking request for ${pickupDate} at ${pickupTime}`, user.id, user.name || "Traveler", user.email || null, user.avatar_url || "/default-avatar.png"],
    );

    return NextResponse.json({ success: true, booking: { id: bookingId, status: "pending" } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/car-bookings error:", error);
    return NextResponse.json({ error: "Unable to save car booking" }, { status: 500 });
  }
}
