"use client";
import { useEffect, useState } from "react";
import { loadUsersFromFirestore } from "@/app/utils/firebase-utils";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { cropsList } from "@/app/utils/plant-utils"; // Assuming you have a separate file for crop options
import GooglePlacesAutocomplete from "@/app/widgets/GoogleMap"; // Assuming you have a Google Map component}

const auth = getAuth(app);

interface UserData {
  email: string;
  first_name: string;
  last_name: string;
}

interface Location {
    latitude: number;
    longitude: number;
  }

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [addingFarm, setAddingFarm] = useState(false);

  const [plants, setPlants] = useState<{ [plantName: string]: number }>({});
  const [selectedPlant, setSelectedPlant] = useState<string>("");
  const [acres, setAcres] = useState<number>(0);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const router = useRouter();

  const cropOptions = cropsList; // Assuming this is an array of crop names
  console.log("Crop Options:", cropsList);
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  

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

  const handleAddPlant = () => {
    if (selectedPlant && acres > 0) {
      setPlants((prev) => ({ ...prev, [selectedPlant]: acres }));
      setSelectedPlant("");
      setAcres(0);
    }
  };

  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
    console.log("Selected Location:", loc);
  };


  const handleSearchLocation = async () => {
    if (!searchText) return;
  
    try {
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchText)}&key=YOUR_OPENCAGE_API_KEY`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
        alert("No locations found.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Failed to search location.");
    }
  };

  const handleSubmitFarm = async () => {
    if (!location || Object.keys(plants).length === 0 || !user) {
      alert("Please add at least one plant and get location.");
      return;
    }
    try {
      const res = await fetch("/api/save-farm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          location,
          plants,
        }),
      });
      if (!res.ok) throw new Error("Failed to save farm");
      alert("Farm saved successfully!");
      setAddingFarm(false);
      setShowPopup(false);
      setPlants({});
      setLocation(null);
    } catch (err) {
      console.error(err);
      alert("Error saving farm");
    }
  };

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
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {!addingFarm ? (
              <>
                <h2 className="text-2xl font-semibold mb-6 text-center">Choose an Option</h2>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => setAddingFarm(true)}
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Add Existing Farm
                  </button>
                  <button className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
                    Plan New Farm
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-xl font-bold mb-4">Add Crops</h2>
                {/* Plant Selector */}
                <select
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  className="border p-2 mb-2 w-full"
                >
                  <option value="">Select a crop</option>
                  {cropOptions?.map((crop) => (
                    <option key={crop} value={crop}>
                      {crop}
                    </option>
                  ))}
                </select>

                {/* Acres Input */}
                <input
                  type="number"
                  placeholder="Acres"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="border p-2 mb-4 w-full"
                />

                <button
                  onClick={handleAddPlant}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-4 w-full"
                >
                  Add Crop
                </button>

                {/* Display added plants */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Added Crops:</h3>
                  <ul className="list-disc list-inside">
                    {Object.entries(plants).map(([plant, acres]) => (
                      <li key={plant}>
                        {plant}: {acres} acres
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Location */}
                <div className="mb-4">
                <GooglePlacesAutocomplete onLocationSelect={handleLocationSelect}/>
                {location && (
                    <pre>{JSON.stringify(location, null, 2)}</pre>
                )}
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Select a location:</h3>
                    <ul className="list-disc list-inside">
                    {searchResults.map((result, index) => (
                        <li
                        key={index}
                        className="cursor-pointer hover:underline"
                        onClick={() => {
                            setLocation({
                            latitude: result.geometry.lat,
                            longitude: result.geometry.lng,
                            });
                            setSearchResults([]);
                            setSearchText("");
                        }}
                        >
                        {result.formatted}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
                {/* Location display */}
                {location && (
                  <p className="text-center mb-4">
                    Location: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                  </p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmitFarm}
                  className="bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition w-full"
                >
                  Submit Farm
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}