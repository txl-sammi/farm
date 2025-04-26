"use client";
import { useEffect, useState } from "react";
import { loadUsersFromFirestore } from "@/app/utils/firebase-utils";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/app/firebase";
import { useRouter } from "next/navigation";

const auth = getAuth(app);

interface UserData {
    email: string;
    first_name: string;
    last_name: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/");
                return;
            }
            setUser(user);
            async function fetchUserData(uid: string) {
                try {
                    const userData = await loadUsersFromFirestore(uid);
                    if (!userData) {
                        throw new Error("User data not found");
                    }
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
        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;

    return (
        <div className="p-6 relative min-h-screen">
            {userData && (
                <div className="mb-4">
                    <p className="text-lg">Email: {userData.email}</p>
                    <p className="text-lg">First Name: {userData.first_name}</p>
                    <p className="text-lg">Last Name: {userData.last_name}</p>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-6">
                Welcome {userData?.first_name} {userData?.last_name}!
            </h1>

            {/* Add New Button */}
            <button
                onClick={() => setShowPopup(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Add New
            </button>

            {/* Popup Modal */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-semibold mb-6 text-center">Choose an Option</h2>
                        <div className="flex flex-col gap-4">
                            <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                                Add Existing Farm
                            </button>
                            <button className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                                Plan New Farm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}