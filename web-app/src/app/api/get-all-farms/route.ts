import { NextRequest, NextResponse } from "next/server";
import { getAllFarms } from "@/app/utils/firebase-utils";

// POST /api/save-farm
export async function POST(req: NextRequest) {
    console.log("Received request to save farm");
    try {
        const body = await req.json();

        const { userId } = body;

        const farms = await getAllFarms(userId);
        console.log("Farms:", farms);

        return NextResponse.json({ farms: farms }, { status: 200 });
    } catch (error) {
        console.error("Error saving farm:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}