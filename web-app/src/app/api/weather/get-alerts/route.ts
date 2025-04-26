import { NextRequest, NextResponse } from "next/server";

// POST /api/save-farm
export async function POST(req: NextRequest) {
    console.log("Received request to save farm");
    try {
        const body = await req.json();

        const { userId, latitude, longitude } = body;

        const apiKey = process.env.WEATHER_API_KEY; // Ensure this is set in your environment variables
        const url = `http://api.weatherapi.com/v1/alerts.json?key=${apiKey}&q=${latitude},${longitude}`;

        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        console.log("Weather alerts:", weatherData);

        return NextResponse.json({ weather: weatherData }, { status: 200 });
    } catch (error) {
        console.error("Error saving farm:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}