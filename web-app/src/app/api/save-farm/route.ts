import { NextRequest, NextResponse } from "next/server";
import { saveFarmToFirestore } from "@/app/utils/firebase-utils";

// POST /api/save-farm
export async function POST(req: NextRequest) {
    console.log("Received request to save farm");
    try {
        const body = await req.json();

        const { userId, name, location, plants } = body;

        if (!userId || !location || !location.latitude || !location.longitude || !plants) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        saveFarmToFirestore(userId, name, location, plants);

        return NextResponse.json({ message: "Farm saved successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error saving farm:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    }