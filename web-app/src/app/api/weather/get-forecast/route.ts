

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { latitude, longitude } = body;

        const apiKey = process.env.WEATHER_API_KEY; // Ensure this is set in your environment variables
        const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=14`;

        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        console.log("Weather forecast:", weatherData);

        return NextResponse.json({ forecast: weatherData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching forecast:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}