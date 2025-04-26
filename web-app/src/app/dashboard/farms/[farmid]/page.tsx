// /app/dashboard/farms/[farmid]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/app/firebase";

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Farm {
  id: string;
  name: string;
  location: Location;
  address: string;
  plants: { [plantName: string]: number };
}

const auth = getAuth(app);

export default function FarmDetailPage() {
    const { farmid } = useParams<{ farmid: string }>();
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [farm, setFarm] = useState<Farm | null>(null);
    const [loadingFarm, setLoadingFarm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [alerts, setAlerts] = useState<any[]>([]); // TODO: Define a proper type for alerts
    const [loadingAlerts, setLoadingAlerts] = useState(true);      

    const [forecastDays, setForecastDays] = useState<any[]>([]);
    const [loadingForecast, setLoadingForecast] = useState(true);

    const [totalAcres, setTotalAcres] = useState(0);
    const [totalPlants, setTotalPlants] = useState(0);
    // wait for auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
        if (!u) {
            router.push("/");            // not signed in → back to home
        } else {
            setUser(u);
        }
        setLoadingAuth(false);
        });
        return unsubscribe;
    }, [router]);

    useEffect(() => {
        if (!user || !farm) return;
        const getAlerts = async () => {
            const res = await fetch("/api/weather/get-alerts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user?.uid, latitude: farm?.location.latitude, longitude: farm?.location.longitude }),
            });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            setAlerts(data.alerts);
            setLoadingAlerts(false);
            console.log("Weather alerts:", data);
        };
        getAlerts();
    }, [user, farm]);

    useEffect(() => {
      if (!user || !farm) return;
      const getForecast = async () => {
        try {
          const res = await fetch("/api/weather/get-forecast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: farm.location.latitude, longitude: farm.location.longitude }),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          setForecastDays(data.forecast.forecast.forecastday);
          console.log("Weather forecast:", data);
        } catch (err) {
          console.error("Error fetching forecast:", err);
        } finally {
          setLoadingForecast(false);
        }
      };
      getForecast();
    }, [user, farm]);

    // fetch this farm once we know user
    useEffect(() => {
        if (!user) return;
        setLoadingFarm(true);
        fetch("/api/get-farm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, farmId: farmid }),
        })
        .then(async (res) => {
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        })
        .then((data) => {
            const farmData = data.farm as Farm;
            setFarm(data.farm as Farm);
            setTotalAcres(
                Object.values(farmData.plants).reduce((acc, acres) => acc + acres, 0)
            );
            setTotalPlants(
                Object.keys(data.farm.plants).length
            );})
        .catch((err) => setError(err.message))
        .finally(() => setLoadingFarm(false));
    }, [user, farmid]);

    if (loadingAuth || loadingFarm) return <div>Loading…</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;
    if (!farm) return <div>No farm data found.</div>;

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">{farm.name} Details</h1>

        <section className="mb-6">
            <h2 className="text-xl font-semibold">Location</h2>
            <p className="italic text-sm">{farm.address}</p>
            <p>
            Latitude: {farm.location.latitude.toFixed(5)},{" "}
            Longitude: {farm.location.longitude.toFixed(5)}
            </p>
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-2">Crops</h2>
            <p>
            Total Acres: {totalAcres} acre{totalAcres !== 1 && "s"}<br />
            Total Plants: {totalPlants} plant{totalPlants !== 1 && "s"}
            </p>
            <ul className="list-disc list-inside">
            {Object.entries(farm.plants)
              .sort(([, acresA], [, acresB]) => acresB - acresA)
              .map(([plant, acres]) => (
                <li key={plant}>
                  {plant}: {Math.round((acres / totalAcres) * 100)}% - {acres} acre{acres !== 1 && "s"}
                </li>
            ))}
            </ul>
        </section>

        <section className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Weather Alerts</h2>
            {loadingAlerts ? (
            <p>Loading alerts...</p>
            ) : (
            <ul className="list-disc list-inside">
                {alerts && alerts.length > 0 ? (
                alerts.map((alert, index) => (
                    <li key={index}>
                    {alert.title}: {alert.description}
                    </li>
                ))
                ) : (
                <li>No weather alerts.</li>
                )}
            </ul>
            )}
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold mb-4">14-Day Forecast</h2>
          {loadingForecast ? (
            <p>Loading forecast...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {forecastDays && forecastDays.map((day) => (
                <div key={day.date} className="p-4 border rounded-lg bg-white shadow-sm">
                  <p className="font-medium">{new Date(day.date).toLocaleDateString()}</p>
                  <img src={day.day.condition.icon} alt={day.day.condition.text} className="mx-auto my-2" />
                  <p className="text-sm">{day.day.condition.text}</p>
                  <p className="text-sm">High: {day.day.maxtemp_c.toFixed(1)}°C</p>
                  <p className="text-sm">Low: {day.day.mintemp_c.toFixed(1)}°C</p>
                  <p className="text-sm">Max Temp: {day.day.maxtemp_c.toFixed(1)}°C / {day.day.maxtemp_f.toFixed(1)}°F</p>
                  <p className="text-sm">Min Temp: {day.day.mintemp_c.toFixed(1)}°C / {day.day.mintemp_f.toFixed(1)}°F</p>
                  <p className="text-sm">Avg Temp: {day.day.avgtemp_c.toFixed(1)}°C / {day.day.avgtemp_f.toFixed(1)}°F</p>
                  <p className="text-sm">Max Wind: {day.day.maxwind_kph.toFixed(1)} kph / {day.day.maxwind_mph.toFixed(1)} mph</p>
                  <p className="text-sm">Precip: {day.day.totalprecip_mm.toFixed(1)} mm / {day.day.totalprecip_in.toFixed(1)} in</p>
                  <p className="text-sm">Snow: {day.day.totalsnow_cm.toFixed(1)} cm</p>
                  <p className="text-sm">Visibility: {day.day.avgvis_km.toFixed(1)} km / {day.day.avgvis_miles.toFixed(1)} miles</p>
                  <p className="text-sm">Humidity: {day.day.avghumidity}%</p>
                  <p className="text-sm">Chance Rain: {day.day.daily_chance_of_rain}% | Will Rain: {day.day.daily_will_it_rain ? 'Yes' : 'No'}</p>
                  <p className="text-sm">Chance Snow: {day.day.daily_chance_of_snow}% | Will Snow: {day.day.daily_will_it_snow ? 'Yes' : 'No'}</p>
                  <p className="text-sm">UV Index: {day.day.uv.toFixed(1)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        </div>
    );
}