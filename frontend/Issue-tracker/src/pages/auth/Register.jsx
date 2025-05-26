// <-- Import the icons
import API from "../../API";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    college: "",
    user_number: "",
    registration_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const colleges = [
    "COCIS",
    "CEDAT",
    "CONAS",
    "CAES",
    "CHUSS",
    "COBAMS",
    "COVAB",
    "SOL",
    "KAES",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const dataToSend = { ...formData };

    // Clean up irrelevant fields based on role
    if (formData.role === "student") {
      delete dataToSend.lecturer_number;
    } else if (formData.role === "lecturer") {
      delete dataToSend.registration_number;
    } else if (formData.role === "registrar") {
      delete dataToSend.user_number;
      delete dataToSend.registration_number;
    }

    try {
      const response = await API.post("/api/auth/register/", dataToSend);
      setSuccess(true);

      localStorage.setItem("otp_email", formData.email);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleSpecificFields = () => {
    if (formData.role === "student") {
      return (
        <>
          <div className="mb-2">
            <label
              htmlFor="user_number"
              className="block mb-2 text-sm text-left font-medium text-gray-600"
            >
              Student Number
            </label>
            <input
              id="user_number"
              name="user_number"
              type="text"
              placeholder="e.g. 2100701234"
              value={formData.user_number}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="registration_number"
              className="block mb-2 text-sm text-left font-medium text-gray-600"
            >
              Registration Number
            </label>
            <input
              id="registration_number"
              name="registration_number"
              type="text"
              placeholder="e.g. 21/U/12345/PS"
              value={formData.registration_number}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </>
      );
    } else if (formData.role === "lecturer") {
      return (
        <div className="mb-2">
          <label
            htmlFor="user_number"
            className="block mb-2 text-sm text-left font-medium text-gray-600"
          >
            Lecturer Number
          </label>
          <input
            id="user_number"
            name="user_number"
            type="text"
            placeholder="e.g. LEC00123"
            value={formData.user_number}
            onChange={handleChange}
            required
            className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="   justify-center items-center bg-gray-100">
      <div className="bg-white p-4 gap-4 rounded-lg shadow-2xl w-full ">
        <h2 className="text-center mb-4 font-bold text-2xl text-blue-900">Register</h2>
        {success ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            Registration successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 mb-2 gap-4">
              <div className="form-field">
                <label
                  htmlFor="first_name"
                  className="block mb-2 text-sm text-left font-medium text-gray-600"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-sm text-left font-medium text-gray-600"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="mb-2">
              <label
                htmlFor="username"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
"
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="e.g. example@university.ac.ug"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
"
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-16"
                  style={{
                    color: "black", // <-- set password text color black
                    backgroundColor: "white", // <-- ensure background is visible
                  }}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                  {/* Eye icon toggle */}
                </button>
              </div>
            </div>

            <div className="mb-2">
              <label
                htmlFor="role"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="registrar">Registrar</option>
              </select>
            </div>

            {renderRoleSpecificFields()}

            <div className="mb-2">
              <label
                htmlFor="college"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                College
              </label>
              <select
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
"
              >
                <option value="" disabled>
                  Select College
                </option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="text-white mt-4 mb-4 bg-blue-950 w-79  hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm  p-2.5 text-center "
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <div className="flex gap-4 mt-4">
              <Link
                to="/login"
                className=" text-blue-600 hover:underline dark:text-blue-700"
              >
                Already have an account? Login
                </Link>
              </div>
              <div className="flex gap-4 mt-4">
              <Link
                to="/"
                className=" text-blue-600 hover:underline dark:text-blue-700"
              >
                Home
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
