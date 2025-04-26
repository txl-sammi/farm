import { NextRequest, NextResponse } from "next/server";
import { loadFarmFromFirestore } from "@/app/utils/firebase-utils";

// POST /api/save-farm
export async function POST(req: NextRequest) {
    console.log("Received request to save farm");
    try {
        const body = await req.json();

        const { userId, farmId } = body;

        const farm = await loadFarmFromFirestore(userId, farmId);

        return NextResponse.json({ farm: farm }, { status: 200 });
    } catch (error) {
        console.error("Error saving farm:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}