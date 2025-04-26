import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from 'openmeteo';

export async function POST(req: NextRequest) {
  try {
    const { latitude, longitude } = await req.json();
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    const params = {
      latitude,
      longitude,
      start_date: today.toISOString().split('T')[0],
      end_date: nextYear.toISOString().split('T')[0],
      "models": ["MRI_AGCM3_2_S", "EC_Earth3P_HR", "NICAM16_8S", "MPI_ESM1_2_XR"],
	    "daily": ["temperature_2m_mean", "soil_moisture_0_to_10cm_mean", "precipitation_sum", "snowfall_sum", "rain_sum"]
    };

    const url = "https://climate-api.open-meteo.com/v1/climate";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const daily = response.daily()!;
    console.log("Daily data:", daily);

    const utcOffsetSeconds = response.utcOffsetSeconds();
    const weatherData = {
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2mMean: daily.variables(0)!.valuesArray()!,
            soilMoisture0To10cmMean: daily.variables(1)!.valuesArray()!,
            precipitationSum: daily.variables(2)!.valuesArray()!,
            snowfallSum: daily.variables(3)!.valuesArray()!,
            rainSum: daily.variables(4)!.valuesArray()!,
        },
    };

    

    const temps = weatherData.daily.temperature2mMean;
    const precips = weatherData.daily.precipitationSum;
    const soilMoisture0To10cmMean = weatherData.daily.soilMoisture0To10cmMean;
    const snowfallSum = weatherData.daily.snowfallSum;
    const rainSum = weatherData.daily.rainSum;
    
    const days = temps.length;
    const avgTemp = temps.reduce((a,b) => a + b, 0) / days;
    const avgPrecip = precips.reduce((a,b) => a + b, 0) / days;
    const avgSnow = snowfallSum.reduce((a,b) => a + b, 0) / days;
    const rainDays = rainSum.filter(v => v > 0).length;
    const soilMoistureAvg = soilMoisture0To10cmMean.reduce((a,b) => a + b, 0) / days;

    for (let i = 0; i < weatherData.daily.time.length; i++) {
      console.log(
        weatherData.daily.time[i].toISOString(),
        weatherData.daily.temperature2mMean[i],
        weatherData.daily.soilMoisture0To10cmMean[i],
        weatherData.daily.precipitationSum[i],
        weatherData.daily.snowfallSum[i],
        weatherData.daily.rainSum[i]
      );
    }

    return NextResponse.json({
        averageTemperatureC: Number(avgTemp.toFixed(2)),
        averagePrecipitationMm: Number(avgPrecip.toFixed(2)),
        averageSnowfallCm: Number(avgSnow.toFixed(2)),
        totalRainDays: rainDays,
        averageSoilMoisture: Number(soilMoistureAvg.toFixed(2)),
        totalDays: days
    });
  } catch (error) {
    console.error("Error computing past stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}