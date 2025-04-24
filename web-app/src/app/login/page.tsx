'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/app/firebase";

const auth = getAuth(app);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return unsubscribe;
  }, []);

  // Login with email/password
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>

        {error && <p className="error">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
        <button onClick={() => router.push("/register")}>
          Not a member? Register
        </button>
      </div>
    </div>
  );
}