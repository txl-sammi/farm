import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/firebase"; // make sure this points to your Firebase setup
import { doc, setDoc } from "firebase/firestore";
import { GeoPoint } from "firebase/firestore";

// POST /api/save-farm
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userId, location, plants } = body;

    if (!userId || !location || !location.latitude || !location.longitude || !plants) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const farmRef = doc(db, "FARMS", userId);

    await setDoc(farmRef, {
      location: new GeoPoint(location.latitude, location.longitude),
      plants: plants,
      createdAt: new Date()
    }, { merge: true });

    return NextResponse.json({ message: "Farm saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving farm:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}