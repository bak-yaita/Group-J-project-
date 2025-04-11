import API from "../../API";
import React, { useState } from "react";

// Import the axios instance

export default function RegisterForm() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Create a copy of the form data to send, removing unused fields
    const dataToSend = { ...formData };

    // Remove irrelevant fields based on role
    if (formData.role === "student") {
      // Keep user_number and registration_number, remove fields not relevant to students
      delete dataToSend.lecturer_number; // Remove any irrelevant fields
    } else if (formData.role === "lecturer") {
      // Keep only user_number for lecturers, remove registration_number and any other irrelevant fields
      delete dataToSend.registration_number;
    } else if (formData.role === "registrar") {
      // Registrars have no user_number or registration_number, so we don't add those fields
      delete dataToSend.user_number;
      delete dataToSend.registration_number;
    }

    try {
      const response = await API.post("/api/auth/register/", dataToSend);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Render role-specific fields based on selected role
  const renderRoleSpecificFields = () => {
    if (formData.role === "student") {
      return (
        <>
          <div className="space-y-2">
            <label
              htmlFor="user_number"
              className="block text-sm font-medium"
            >
              Student Number
            </label>
            <input
              id="user_number"
              name="user_number"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.user_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="registration_number"
              className="block text-sm font-medium"
            >
              Registration Number
            </label>
            <input
              id="registration_number"
              name="registration_number"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.registration_number}
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    } else if (formData.role === "lecturer") {
      return (
        <div className="space-y-2">
          <label
            htmlFor="user_number"
            className="block text-sm font-medium"
          >
            Lecturer Number
          </label>
          <input
            id="user_number"
            name="user_number"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.user_number}
            onChange={handleChange}
            required
          />
        </div>
      );
    } else if (formData.role === "registrar") {
      // No additional fields for registrars
      return null;
  }

  return null;
};
  

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        {success ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-md">
            Registration successful! You can now log in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium"
                >
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="registrar">Registrar</option>
              </select>
            </div>

            {/* Conditional fields based on role */}
            {renderRoleSpecificFields()}

            <div className="space-y-2">
              <label htmlFor="college" className="block text-sm font-medium">
                College
              </label>
              <select
                id="college"
                name="college"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.college}
                onChange={handleChange}
                required
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
              className="w-full py-2 px-4 bg-blue-950 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

