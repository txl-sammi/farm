"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import GooglePlacesAutocomplete from "@/app/widgets/GoogleMap";
import styles from "./plan.module.css";
import { cropAttributes } from "@/app/utils/plant-utils";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/app/firebase";
import Link from "next/link";
import { signOut } from "firebase/auth";

// Crop suitability attributes
interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface FutureStats {
  averageTemperatureC: number;
  averagePrecipitationMm: number;
  averageSnowfallCm: number;
  totalRainDays: number;
  averageRainDaysPerDay: number;
  averageSoilMoisture: number;
}

export default function PlanPage() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [stats, setStats] = useState<FutureStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropTable, setShowCropTable] = useState(false);
  const [cropRankings, setCropRankings] = useState<{ name: string; score: number }[]>([]);
  const [totalAcres, setTotalAcres] = useState<number>(0);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<{ [crop: string]: number } | null>(null);
  const [farmName, setFarmName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, []);
  
  const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push('/login'); // Redirect to login after logout
      } catch (error) {
        console.error("Error signing out: ", error);
        alert("Failed to sign out.");
      }
    };

  const calculateCropShares = (acres: number, crops: string[]) => {
    const totalShares = crops.reduce((acc, crop) => {
        const cropScore = cropRankings.find((c) => c.name === crop)?.score || 0;
        console.log("Crop to add share:", crop, "Score:", cropScore);
        return acc + cropScore ** 2; // Square the score to give more weight to higher scores
      }, 0);
    return crops.reduce((acc, crop) => {
      const cropScore = cropRankings.find((c) => c.name === crop)?.score || 0;
      console.log("Crop:", crop, "Score:", cropScore, "Total Shares:", totalShares);
      const propotionalShare = (cropScore**2 / totalShares) * acres;
      return { ...acc, [crop]: propotionalShare };
    }, {});
  };

  const handleSaveFarm = async () => {
    if (!user) {
      alert("You must be logged in to save a farm.");
      return;
    }
    if (!farmName) {
      alert("Please enter a farm name.");
      return;
    }
    if (!location || !recommendations) {
      alert("No farm data to save.");
      return;
    }
    try {
      const res = await fetch("/api/save-farm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          name: farmName,
          location,
          plants: recommendations,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save farm");
      }
      // Redirect to dashboard on successful save
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      alert(`Error saving farm: ${err.message}`);
    }
  };


  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
  };

  useEffect(() => {
    if (!location) return;
    setLoading(true);
    setError(null);
    fetch("/api/weather/get-future-stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weather predictions");
        return res.json();
      })
      .then((data: FutureStats) => {
        setStats(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [location]);

  const rankedCrops = useMemo(() => {
    if (!stats) return [];
    const rankings = Object.entries(cropAttributes).map(([name, attr]) => {
        const temp = stats.averageTemperatureC;
        const [min, max] = attr.optimalTempRangeC;
        // Temperature suitability: higher if closer to mean and in-range, otherwise decrease exponentially outside
        let tempScore = 0;
        const range = max - min;
        const mid = (min + max) / 2;
        console.log("Crop:", name, "Temp:", temp, "Range:", range, "Mid:", mid);

        if (temp >= min && temp <= max) {
            const distanceToMid = Math.abs(temp - mid);
            tempScore = 4 * (1 - (distanceToMid / (range / 2))); // Perfect at mid, lower at edges
            console.log("In range, score:", tempScore);
        } else {
            const distanceOutside = temp < min ? min - temp : temp - max;
            tempScore = Math.max(0, 4 - (distanceOutside / (range / 2)) * 4); // Heavily penalize
        }
        // Rainfall contribution
        const difference = Math.abs(attr.rainfallCorrelation - stats.averagePrecipitationMm/6);
        const rainScore = Math.max(0, 5 - difference * 5); // Adjust the multiplier as needed
        setCropRankings
        return { name, score: tempScore + rainScore };
    })
    .sort((a, b) => b.score - a.score)
    setCropRankings(rankings);
    return rankings.slice(0, 5); // Top 5 crops
  }, [stats]);

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
      <h1 className={styles.title}>Plan a New Farm</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Choose Location</h2>
        <GooglePlacesAutocomplete
          onLocationSelect={handleLocationSelect}
          initialAddress={location?.address || ""}
        />
        {location && (
          <p className={styles.selected}>
            Selected: {location.address} (
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
          </p>
        )}
      </section>

      {location && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            2. Predicted Next-Year Averages
          </h2>
          {loading && <p>Loading predictions...</p>}
          {error && <p className={styles.error}>Error: {error}</p>}
          {stats && (
            <ul className="list-disc list-inside">
              {typeof stats.averageTemperatureC === "number" && (
                <li>
                  Avg Temp: {stats.averageTemperatureC.toFixed(1)}°C
                </li>
              )}
              {typeof stats.averagePrecipitationMm === "number" && (
                <li>
                  Avg Precipitation: {stats.averagePrecipitationMm.toFixed(1)}{" "}
                  mm
                </li>
              )}
              {typeof stats.averageSnowfallCm === "number" && (
                <li>
                  Avg Snowfall: {stats.averageSnowfallCm.toFixed(1)} cm
                </li>
              )}
              {typeof stats.totalRainDays === "number" && (
                <li>Total Rain Days: {stats.totalRainDays} days</li>
              )}
              {typeof stats.averageRainDaysPerDay === "number" && (
                <li>
                  Avg Rain Days/Day:{" "}
                  {(stats.averageRainDaysPerDay * 100).toFixed(2)}%
                </li>
              )}
              {typeof stats.averageSoilMoisture === "number" && (
                <li>Avg Soil Moisture: {stats.averageSoilMoisture.toFixed(2)}</li>
              )}
            </ul>
          )}
        </section>
      )}

        {stats && rankedCrops.length > 0 && (
            <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Strongest Crops</h2>
            <ol className="list-decimal list-inside">
                {rankedCrops.map((crop) => (
                <li key={crop.name}>
                    {crop.name} (Score: {crop.score.toFixed(2)}/10)
                </li>
                ))}
            </ol>
            </section>
        )}

      {stats && rankedCrops.length > 0 && (
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Crop Allocation</h2>
        <div>
          <label>
            Total Acres:
            <input
              type="number"
              value={totalAcres}
              onChange={(e) => setTotalAcres(Number(e.target.value))}
              min="0"
            />
          </label>
        </div>
        <div className={styles.cropSelectionGrid}>
          <h3>Select Crops:</h3>
          {Object.keys(cropAttributes).sort().map((name) => (
            <label key={name} style={{ display: 'block', margin: '4px 0' }}>
              <input
                type="checkbox"
                value={name}
                checked={selectedCrops.includes(name)}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCrops((prev) =>
                    prev.includes(value)
                      ? prev.filter((c) => c !== value)
                      : [...prev, value]
                  );
                }}
              />
              {name}
            </label>
          ))}
        </div>
        <button onClick={() => setRecommendations(calculateCropShares(totalAcres, selectedCrops))} className={styles.primaryButton}>
          Calculate Shares
        </button>
      </section>
      )}

      {recommendations && (
      <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommendations</h2>
        <ul className="list-disc list-inside">
          {Object.entries(recommendations).map(([crop, acres]) => (
            <li key={crop}>
              {crop}: {acres.toFixed(2)} acres
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>5. Save Farm</h2>
        
        <div>
          <label htmlFor="farmNameInput">Farm Name:</label>
          <input
            id="farmNameInput"
            type="text"
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            className={styles.popupInput}
            placeholder="Enter farm name"
          />
        </div>
        <button onClick={handleSaveFarm} className={styles.primaryButton}>
          Save Farm
        </button>
      </section>
      </>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Crop Sensitivities</h2>
        <div className={styles.cropTableWrapper}>
          {showCropTable && (
            <table className={styles.cropTable}>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Temp Range (°C)</th>
                  <th>Rain Correlation</th>
                  <th>Snow Correlation</th>
                  <th>Pest Sensitivity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(cropAttributes)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([name, attr]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{attr.optimalTempRangeC[0]}–{attr.optimalTempRangeC[1]}</td>
                      <td>{attr.rainfallCorrelation}</td>
                      <td>{attr.snowCorrelation}</td>
                      <td>{attr.pestSensitivity}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          <button
            className={styles.primaryButton}
            onClick={() => setShowCropTable(!showCropTable)}
          >
            {showCropTable ? "Hide All Crops" : "Show All Crops"}
          </button>
        </div>
      </section>
    </div>
  );
}