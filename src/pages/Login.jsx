import React, { useState } from "react";
import { database } from "/firebase.js"; // Path ke firebase.js
import { ref, get, child } from "firebase/database";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `admin`)); // Ambil data dari /admin
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        const admin = Object.values(adminData).find(
          (admin) => admin.username === username && admin.password === password
        );

        if (admin) {
          toast.success("Login berhasil!");
          navigate("/dashboard");
        } else {
          alert("Username atau password salah!");
        }
      } else {
        alert("Data admin tidak ditemukan!");
      }
    } catch (error) {
      console.error("Error saat login:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-indigo-600 to-blue-400">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login Sebagai Admin
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-500 hover:text-blue-700">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
