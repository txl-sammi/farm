// /app/dashboard/farms/[farmid]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
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
        .then((data) => setFarm(data.farm as Farm))
        .catch((err) => setError(err.message))
        .finally(() => setLoadingFarm(false));
    }, [user, farmid]);

    if (loadingAuth || loadingFarm) return <div>Loading…</div>;
    if (error) return <div className="text-red-600">Error: {error}</div>;
    if (!farm) return <div>No farm data found.</div>;

    return (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Farm Details</h1>

        <section className="mb-6">
            <h2 className="text-xl font-semibold">Name</h2>
            <p>{farm.name}</p>
        </section>

        <section className="mb-6">
            <h2 className="text-xl font-semibold">Location</h2>
            <p>
            {farm.location.latitude.toFixed(5)},{" "}
            {farm.location.longitude.toFixed(5)}
            </p>
            {farm.location.address && (
            <p className="italic text-sm">{farm.location.address}</p>
            )}
        </section>

        <section>
            <h2 className="text-xl font-semibold mb-2">Crops</h2>
            <ul className="list-disc list-inside">
            {Object.entries(farm.plants).map(([plant, acres]) => (
                <li key={plant}>
                {plant}: {acres} acre{acres !== 1 && "s"}
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
        </div>
    );
}