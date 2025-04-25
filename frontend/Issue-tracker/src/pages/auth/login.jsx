import API from "../../API";
import issue from "../../assets/issue.jpg";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import picture from "../../assets/picture.jpg"

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios to send credentials with requests
  axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await API.post(
        "api/auth/login/",
        formData,
      );

      console.log("Login successful:", response.data);
      navigate("/dashbord"); // Redirect to the dashboard or any other page after login

      // For session auth, you don't need to store a token
      // The browser will automatically handle the session cookie
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } 
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-4 flex gap-3 rounded-lg shadow-2xl">
        <div>
          <h2 className="text-left mb-4 font-bold text-blue-400">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.name}
                placeholder="Enter your User Name"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-left font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="text-white mt-4 mb-4 bg-blue-950 w-79 hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center"
            >
              {loading ? "LOGGING IN..." : "L O G I N"}
            </button>
          </form>
          <div>
            <div className="flex items-start mb-5">
              <label
                htmlFor="terms"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                You don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline dark:text-blue-500"
                >
                  Register
                </Link>
              </label>
            </div>
          </div>
        </div>
        <div className="hidden md:block bg-green-300 rounded-lg overflow-hidden">
          <img src={picture} alt="picture" className="h-full w-80 grayscale-100" />
        </div>
      </div>
    </div>
  );
}

export default Login;
