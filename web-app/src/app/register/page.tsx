'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { app } from "@/app/firebase"; // Ensure your firebase config is exported from here
import { saveUserToFirestore } from "@/app/utils/firebase-utils";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const auth = getAuth(app);

const RegisterPage = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in", user);
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignUp = async (): Promise<void> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (!auth.currentUser) {
        throw new Error("User not authenticated");
      }
      saveUserToFirestore(auth.currentUser.uid, email, firstName, lastName);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Login</h1>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            placeholder="Enter your first name"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            placeholder="Enter your last name"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #e3f2fd;
        }
        .card {
          background: #fff;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 300px;
        }
        h1 {
          margin-bottom: 1.5rem;
        }
        .error {
          color: red;
          margin-bottom: 1rem;
        }
        .form-group {
          margin-bottom: 1rem;
          text-align: left;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }
        button {
          background-color: #0288d1;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover {
          background-color: #0277bd;
        }
        .google-btn {
          width: 100%;
          margin-top: 1rem;
          background-color: #db4437;
        }
        .google-btn:hover {
          background-color: #c33d2e;
        }
        hr {
          margin: 1.5rem 0;
          border: none;
          border-top: 1px solid #eee;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
;