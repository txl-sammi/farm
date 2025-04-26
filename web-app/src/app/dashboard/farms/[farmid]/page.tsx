// /app/dashboard/farms/[farmid]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth"; // Added signOut
import { app } from "@/app/firebase";
import Link from "next/link"; // Import Link
import styles from './farm-detail.module.css'; // Import the CSS module

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface Farm {
  id: string;
  name: string;
  location: Location;
  address: string; // Assuming address is fetched now
  plants: { [plantName: string]: number };
}

// Define a type for forecast day data for better type safety
interface ForecastDay {
  date: string;
  day: {
    condition: {
      icon: string;
      text: string;
    };
    maxtemp_c: number;
    mintemp_c: number;
    maxtemp_f: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_kph: number;
    maxwind_mph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_chance_of_rain: number;
    daily_will_it_rain: number; // 0 or 1
    daily_chance_of_snow: number;
    daily_will_it_snow: number; // 0 or 1
    uv: number;
  };
}

// Define a type for alert data
interface WeatherAlert {
  headline: string; // Assuming 'headline' exists based on common API structures
  event: string; // Assuming 'event' exists
  desc: string; // Assuming 'desc' exists
  // Add other relevant fields from your API response
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

  const [alerts, setAlerts] = useState<WeatherAlert[]>([]); // Use defined type
  const [loadingAlerts, setLoadingAlerts] = useState(true);

    const [forecastDays, setForecastDays] = useState<any[]>([]);
    const [loadingForecast, setLoadingForecast] = useState(true);
    const [pastStats, setPastStats] = useState<{
      averageTemperatureC: number;
      averagePrecipitationMm: number;
      averageSnowfallCm: number;
      averageRainDaysPerDay: number;
      totalRainDays: number;
      averageSoilMoisture: number;
      totalDays: number;
    } | null>(null);
    const [loadingPastStats, setLoadingPastStats] = useState(true);

  const [totalAcres, setTotalAcres] = useState(0);
  const [totalPlants, setTotalPlants] = useState(0);

  // wait for auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/"); // not signed in → back to home
      } else {
        setUser(u);
      }
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, [router]);

  // Fetch farm details
  useEffect(() => {
    if (!user) return;
    setLoadingFarm(true);
    setError(null); // Reset error on new fetch
    fetch("/api/get-farm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.uid, farmId: farmid }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Error response from /api/get-farm:", errorText);
          throw new Error(errorText || "Failed to fetch farm data");
        }
        return res.json();
      })
      .then((data) => {
        if (!data.farm) {
          throw new Error("Farm data not found in response.");
        }
        const farmData = data.farm as Farm;
        // Ensure plants is an object, default to empty if not
        farmData.plants = typeof farmData.plants === 'object' && farmData.plants !== null ? farmData.plants : {};
        setFarm(farmData);

        const acresArray = Object.values(farmData.plants);
        const currentTotalAcres = acresArray.reduce((acc, acres) => acc + (Number(acres) || 0), 0);
        setTotalAcres(currentTotalAcres);
        setTotalPlants(Object.keys(farmData.plants).length);
      })
      .catch((err) => {
        console.error("Error fetching farm:", err);
        setError(err.message || "An unknown error occurred while fetching farm data.");
      })
      .finally(() => setLoadingFarm(false));
  }, [user, farmid]);


  // Fetch alerts
  useEffect(() => {
    if (!user || !farm?.location) return;
    setLoadingAlerts(true);
    const getAlerts = async () => {
      try {
        const res = await fetch("/api/weather/get-alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, latitude: farm.location.latitude, longitude: farm.location.longitude }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // Make sure data.alerts.alert is the array, adjust if needed based on actual API response
        setAlerts(data.alerts?.alert || []);
        console.log("Weather alerts:", data);
      } catch (err: any) {
        console.error("Error fetching alerts:", err);
        // Optionally set an error state for alerts
      } finally {
        setLoadingAlerts(false);
      }
    };
    getAlerts();
  }, [user, farm]);

  // Fetch forecast
  useEffect(() => {
    if (!user || !farm?.location) return;
    setLoadingForecast(true);
    const getForecast = async () => {
      try {
        const res = await fetch("/api/weather/get-forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: farm.location.latitude, longitude: farm.location.longitude }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // Ensure the path to forecastday array is correct
        setForecastDays(data.forecast?.forecast?.forecastday || []);
        console.log("Weather forecast:", data);
      } catch (err: any) {
        console.error("Error fetching forecast:", err);
        // Optionally set an error state for forecast
      } finally {
        setLoadingForecast(false);
      }
    };
    getForecast();
  }, [user, farm]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Error signing out: ", error);
      alert("Failed to sign out.");
    }
  };

    useEffect(() => {
      if (!user || !farm) return;
      const getPastStats = async () => {
        try {
          const res = await fetch("/api/weather/get-future-stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude: farm.location.latitude, longitude: farm.location.longitude }),
          });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          setPastStats(data);
        } catch (err) {
          console.error("Error fetching past stats:", err);
        } finally {
          setLoadingPastStats(false);
        }
      };
      getPastStats();
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
  // Loading and Error States
  if (loadingAuth) return <div className="flex justify-center items-center min-h-screen">Authenticating...</div>;
  if (!user) return null; // Should be redirected by auth listener
  if (loadingFarm) return <div className="flex justify-center items-center min-h-screen">Loading Farm Data...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading farm: {error} <Link href="/dashboard" className="text-blue-600 underline">Go back to Dashboard</Link></div>;
  if (!farm) return <div className="p-6">Farm not found. <Link href="/dashboard" className="text-blue-600 underline">Go back to Dashboard</Link></div>;


  return (
    <div className={styles.container}>
      {/* Header/Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link href="/">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#5C6F40" fillOpacity="0.8" />
              <path d="M14 15C14 13.8954 14.8954 13 16 13H24C25.1046 13 26 13.8954 26 15V25C26 26.1046 25.1046 27 24 27H16C14.8954 27 14 26.1046 14 25V15Z" stroke="white" strokeWidth="2" />
              <path d="M18 18L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 18L18 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
        <div className={styles.navLinks}>
          <Link href="/dashboard">Dashboard</Link> {/* Link back to dashboard */}
          <Link href="/about">About</Link>
          <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.farmDetailContent}>
        <h1 className={styles.pageTitle}>{farm.name}</h1>

        <section className={styles.super_section}>
            {/* Location Section */}
            <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{farm.address || "Address not available"}</h2>
            <p className={styles.locationCoords}>
                Latitude: {farm.location.latitude.toFixed(5)},{" "}
                Longitude: {farm.location.longitude.toFixed(5)}
            </p>
            <h4 className={styles.sectionTitle}>Next Year Weather Averages Predictions</h4>
            {loadingPastStats ? (
                <p>Loading stats...</p>
            ) : pastStats ? (
            <ul className="list-disc list-inside">
            {typeof pastStats.averageTemperatureC === 'number' && (
                <li>Avg Temp: {pastStats.averageTemperatureC}°C</li>
            )}
            {typeof pastStats.averagePrecipitationMm === 'number' && (
                <li>Avg Precipitation: {pastStats.averagePrecipitationMm} mm</li>
            )}
            {typeof pastStats.averageSnowfallCm === 'number' && (
                <li>Avg Snowfall: {pastStats.averageSnowfallCm} cm</li>
            )}
            {typeof pastStats.totalRainDays === 'number' && pastStats.totalRainDays>0 && (
                <li>Total Rain Days: {pastStats.totalRainDays} days</li>
            )}
            {typeof pastStats.averageRainDaysPerDay === 'number' && (
                <li>Avg Rain Days per Day: {(pastStats.averageRainDaysPerDay * 100).toFixed(2)}%</li>
            )}
            {typeof pastStats.averageSoilMoisture === 'number' && (
                <li>Avg Soil Moisture: {pastStats.averageSoilMoisture}</li>
            )}
            </ul>
                ) : (
                    <p>No past stats available.</p>
                )}
            </section>

            
            
            {/* Crops Section */}
            <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Crops</h2>
            <div className={styles.cropInfo}>
                Total Acres: {totalAcres.toFixed(1)} acre{totalAcres !== 1 ? "s" : ""}<br />
                Total Plant Types: {totalPlants}
            </div>
            <ul className={styles.cropList}>
                {Object.entries(farm.plants)
                .sort(([, acresA], [, acresB]) => (Number(acresB) || 0) - (Number(acresA) || 0)) // Sort descending by acres
                .map(([plant, acres]) => {
                    const numericAcres = Number(acres) || 0;
                    const percentage = totalAcres > 0 ? Math.round((numericAcres / totalAcres) * 100) : 0;
                    return (
                    <li key={plant} className={styles.cropListItem}>
                        {plant}: {percentage}% - {numericAcres.toFixed(1)} acre{numericAcres !== 1 ? "s" : ""}
                    </li>
                    );
                })}
            </ul>
            </section>
        </section>

        {/* Weather Section */}
        {/* Weather Alerts Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Weather Alerts</h2>
          {loadingAlerts ? (
            <p>Loading alerts...</p>
          ) : (
            <ul className={styles.alertList}>
              {alerts && alerts.length > 0 ? (
                alerts.map((alert, index) => (
                  <li key={index} className={styles.alertListItem}>
                    <strong>{alert.event || alert.headline || 'Alert'}</strong>: {alert.desc || 'No description available.'}
                  </li>
                ))
              ) : (
                <li className={styles.noAlerts}>No active weather alerts.</li>
              )}
            </ul>
          )}
        </section>

        {/* Forecast Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>14-Day Forecast</h2>
          {loadingForecast ? (
            <p>Loading forecast...</p>
          ) : (
            <div className={styles.forecastGrid}>
              {forecastDays && forecastDays.length > 0 ? forecastDays.map((day) => (
                <div key={day.date} className={styles.forecastCard}>
                  <p className={styles.forecastDate}>{new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                  <img src={day.day.condition.icon} alt={day.day.condition.text} className={styles.forecastIcon} width="48" height="48" />
                  <p className={styles.forecastCondition}>{day.day.condition.text}</p>
                  <p className={styles.forecastDetail}><strong>High:</strong> {day.day.maxtemp_c.toFixed(0)}°C / {day.day.maxtemp_f.toFixed(0)}°F</p>
                  <p className={styles.forecastDetail}><strong>Low:</strong> {day.day.mintemp_c.toFixed(0)}°C / {day.day.mintemp_f.toFixed(0)}°F</p>
                  <p className={styles.forecastDetail}><strong>Wind:</strong> {day.day.maxwind_kph.toFixed(0)} kph</p>
                  <p className={styles.forecastDetail}><strong>Precip:</strong> {day.day.totalprecip_mm.toFixed(1)} mm</p>
                  <p className={styles.forecastDetail}><strong>Rain:</strong> {day.day.daily_chance_of_rain}%</p>
                  {/* <p className={styles.forecastDetail}>Avg Temp: {day.day.avgtemp_c.toFixed(1)}°C / {day.day.avgtemp_f.toFixed(1)}°F</p> */}
                  {/* <p className={styles.forecastDetail}>Snow: {day.day.totalsnow_cm.toFixed(1)} cm</p> */}
                  {/* <p className={styles.forecastDetail}>Visibility: {day.day.avgvis_km.toFixed(1)} km / {day.day.avgvis_miles.toFixed(1)} miles</p> */}
                  {/* <p className={styles.forecastDetail}>Humidity: {day.day.avghumidity}%</p> */}
                  {/* <p className={styles.forecastDetail}>Chance Snow: {day.day.daily_chance_of_snow}% | Will Snow: {day.day.daily_will_it_snow ? 'Yes' : 'No'}</p> */}
                  {/* <p className={styles.forecastDetail}>UV Index: {day.day.uv.toFixed(1)}</p> */}
                </div>
              )) : <p>Forecast data not available.</p>}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>
          {/* Optional: Link logo in footer */}
          {/* <Link href="/"> */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#5C6F40" fillOpacity="0.8" />
            <path d="M14 15C14 13.8954 14.8954 13 16 13H24C25.1046 13 26 13.8954 26 15V25C26 26.1046 25.1046 27 24 27H16C14.8954 27 14 26.1046 14 25V15Z" stroke="white" strokeWidth="2" />
            <path d="M18 18L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 18L18 22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* </Link> */}
        </div>
        <div className={styles.socialLinks}>
          <a href="#" aria-label="Facebook">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M17.5 6.5H17.51" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
          {/* Add other social links if needed */}
        </div>
      </footer>
    </div>
  );
}