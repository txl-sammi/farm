"use client";
import { useEffect, useState } from "react";
import { loadUsersFromFirestore } from "@/app/utils/firebase-utils";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth"; // Added signOut
import { app } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { cropsList } from "@/app/utils/plant-utils";
import GooglePlacesAutocomplete from "@/app/widgets/GoogleMap";
import Link from "next/link";
import styles from './dashboard.module.css'; // Import the CSS module

const auth = getAuth(app);

interface UserData {
    email: string;
    first_name: string;
    last_name: string;
}

interface Location {
    latitude: number;
    longitude: number;
    address: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [addingFarm, setAddingFarm] = useState(false);

    const [farms, setFarms] = useState<any[]>([]);

    const [farmName, setFarmName] = useState("");

    const [plants, setPlants] = useState<{ [plantName: string]: number }>({});
    const [selectedPlant, setSelectedPlant] = useState<string>("");
    const [acres, setAcres] = useState<number>(0);

    const [location, setLocation] = useState<Location | null>(null);
    const router = useRouter();

    const cropOptions = cropsList;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login"); // Redirect to login if not authenticated
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
    }, [router]); // Added router dependency

    useEffect(() => {
        if (user) { // Fetch farms only when user is available
            fetchUserFarms();
        }
    }, [user]);

    const fetchUserFarms = async () => {
        if (!user) return;
        setLoading(true); // Indicate loading state for farms
        try {
            const res = await fetch("/api/get-all-farms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.uid }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to fetch farms");
            }
            const data = await res.json();
            setFarms(data.farms || []); // Ensure farms is an array
        } catch (err: any) {
            console.error("Error fetching farms:", err);
            setError(err.message || "Failed to load farms");
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlant = () => {
        if (selectedPlant && acres > 0) {
            setPlants((prev) => ({ ...prev, [selectedPlant]: acres }));
            setSelectedPlant("");
            setAcres(0);
        } else {
            alert("Please select a crop and enter a valid acreage.");
        }
    };

    const handleLocationSelect = (loc: Location) => {
        setLocation(loc);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login'); // Redirect to login after logout
        } catch (error) {
            console.error("Error signing out: ", error);
            alert("Failed to sign out.");
        }
    };

    const resetAddFarmForm = () => {
        setAddingFarm(false);
        setShowPopup(false);
        setPlants({});
        setLocation(null);
        setFarmName("");
        setSelectedPlant("");
        setAcres(0);
    };

    const handleSubmitFarm = async () => {
        if (!farmName) {
            alert("Please enter a farm name.");
            return;
        }
        if (!location) {
            alert("Please select a location.");
            return;
        }
        if (Object.keys(plants).length === 0) {
            alert("Please add at least one crop.");
            return;
        }
        if (!user) {
            alert("User not authenticated.");
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
                    plants,
                }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to save farm");
            }
            alert("Farm saved successfully!");
            resetAddFarmForm();
            fetchUserFarms(); // Refresh the farm list
        } catch (err: any) {
            console.error(err);
            alert(`Error saving farm: ${err.message}`);
        }
    };

    // Display loading state centrally
    if (loading && !userData) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    // Display error state centrally
    if (error && !userData) return <div className="flex justify-center items-center min-h-screen">Error: {error}</div>;
    // This check might be redundant due to onAuthStateChanged redirect, but good practice
    if (!user || !userData) return null; // Or a redirect component

    return (
        <div className={styles.container}>
            {/* Header/Navbar */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>
                    {/* Using Link for client-side navigation */}
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
                    {/* Add relevant dashboard nav links if needed */}
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>
                    <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
                </div>
            </nav>

            {/* Main Dashboard Content */}
            <main className={styles.dashboardContent}>
                <div className={styles.welcomeBox}> {/* Added wrapper div */}
                    <h1 className="text-2xl font-bold mb-2"> {/* Keep Tailwind for text size/weight or move to CSS */}
                        Welcome {userData.first_name} {userData.last_name}!
                    </h1>
                    <p>Email: {userData.email}</p>
                </div>

                {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">Error: {error}</div>}

                <h2 className={styles.sectionTitle}>Your Farms:</h2>
                {loading && farms.length === 0 && <div>Loading farms...</div>}
                {!loading && farms.length === 0 && <p>You haven't added any farms yet.</p>}
                <ul className={styles.farmList}>
                    {farms.map((farm) => (
                        <li key={farm.id}>
                            <Link href={`/dashboard/farms/${farm.id}`} className={styles.farmItemLink}>
                                <div className={styles.farmItem}>
                                    <strong>{farm.name}</strong> - {farm.address}
                                    <ul className={styles.plantList}>
                                        {Object.entries(farm.plants).map(([plant, acres]) => (
                                            <li key={plant}>
                                                {plant}: {acres as number} acres
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Add New Button */}
                <button
                    onClick={() => setShowPopup(true)}
                    className={styles.addButton}
                >
                    Add New Farm/Plan
                </button>
            </main>

            {/* Popup Modal */}
            {showPopup && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popupCard}>
                        <button
                            onClick={resetAddFarmForm} // Use reset function for close
                            className={styles.closeButton}
                            aria-label="Close popup"
                        >
                            ✕
                        </button>

                        {!addingFarm ? (
                            <>
                                <h2 className={styles.popupTitle}>Choose an Option</h2>
                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={() => setAddingFarm(true)}
                                        className={styles.primaryButton} // Use consistent button styles
                                    >
                                        Add Existing Farm
                                    </button>
                                    <button className={styles.tertiaryButton} disabled> {/* Disable unimplemented feature */}
                                        Plan New Farm (Coming Soon)
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h2 className={styles.popupTitle}>Add New Farm</h2>
                                <label htmlFor="farmName" className={styles.popupLabel}>Farm Name</label>
                                <input
                                    id="farmName"
                                    type="text"
                                    placeholder="Enter Farm Name"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    className={styles.popupInput}
                                    required
                                />

                                <label htmlFor="cropSelect" className={styles.popupLabel}>Add Crops</label>
                                <select
                                    id="cropSelect"
                                    value={selectedPlant}
                                    onChange={(e) => setSelectedPlant(e.target.value)}
                                    className={styles.popupSelect}
                                >
                                    <option value="">Select a crop</option>
                                    {cropOptions?.map((crop) => (
                                        <option key={crop} value={crop}>
                                            {crop}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="acresInput" className={styles.popupLabel}>Acres</label>
                                <input
                                    id="acresInput"
                                    type="number"
                                    placeholder="Acres"
                                    value={acres}
                                    onChange={(e) => setAcres(Number(e.target.value))}
                                    className={styles.popupInput}
                                    min="0" // Prevent negative acres
                                />

                                <button
                                    onClick={handleAddPlant}
                                    className={`${styles.secondaryButton} mb-4`} // Use consistent button styles
                                >
                                    Add Crop
                                </button>

                                {/* Display added plants */}
                                {Object.keys(plants).length > 0 && (
                                    <div className="mb-4">
                                        <h3 className={styles.popupLabel}>Added Crops:</h3>
                                        <ul className={styles.addedCropsList}>
                                            {Object.entries(plants).map(([plant, numAcres]) => (
                                                <li key={plant}>
                                                    {plant}: {numAcres} acres
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="mb-4">
                                    <label className={styles.popupLabel}>Select Location:</label>
                                    <GooglePlacesAutocomplete
                                        onLocationSelect={handleLocationSelect}
                                        initialAddress={location?.address || ""}
                                    />
                                    {/* Optional: Display selected location details */}
                                    {/* {location && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Selected: {location.address} ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
                                    </p>
                                )} */}
                                </div>

                                {/* Submit */}
                                <button
                                    onClick={handleSubmitFarm}
                                    className={styles.primaryButton} // Use consistent button styles
                                >
                                    Submit Farm
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

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