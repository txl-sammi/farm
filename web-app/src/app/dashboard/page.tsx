"use client";
import { useEffect, useState } from "react";
import { loadUsersFromFirestore } from "@/app/utils/firebase-utils"; // Update this path as needed
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "@/app/firebase"; // Ensure your firebase config is exported from here
import { useRouter } from "next/navigation";

const auth = getAuth(app);

// Assuming getUserFromFirestore is imported from somewhere in your project

interface UserData {
    email: string;
    first_name: string;
    last_name: string;
    // Add any other user fields you need
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/");
                return;
            }
    
            setUser(user);  // optional if needed elsewhere
    
            async function fetchUserData(uid: string) {
                try {
                    const userData = await loadUsersFromFirestore(uid);
                    if (!userData) {
                        throw new Error("User data not found");
                    }
                    console.log("User data:", userData as UserData);
                    setUserData(userData as UserData);
                } catch (err) {
                    console.error("Error fetching user:", err);
                    setError("Failed to load user data");
                } finally {
                    setLoading(false);
                }
            }
    
            fetchUserData(user.uid);
        });
    
        return () => unsubscribe(); // clean up listener
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;

    return (
        <div className="p-6">
            {userData && (
                <div className="mb-4">
                    <p className="text-lg">Email: {userData.email}</p>
                    <p className="text-lg">First Name: {userData.first_name}</p>
                    <p className="text-lg">Last Name: {userData.last_name}</p>
                </div>
            )}
            <h1 className="text-2xl font-bold">Welcome {userData?.first_name} {userData?.last_name}!</h1>
        </div>
    );
}