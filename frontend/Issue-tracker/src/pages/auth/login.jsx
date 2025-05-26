import API from "../../API";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo.jpeg"; 

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp(otp);
    }
  }, [otp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/login/", formData);

      // Save tokens
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Check OTP requirement
      if (response.data.otp_required) {
        setOtpRequired(true);
        toast.info("OTP verification required", { autoClose: 10000 });
      } else if (response.data.role) {
        toast.success("Login successful!", { autoClose: 3000 });
        handleRoleRedirect(response.data.role);
      } else {
        toast.error("User role missing. Contact system admin.", {
          autoClose: 10000,
        });
      }
    } catch (err) {
      // Safely get error message
      const errorMessage =
        err.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      console.error("Login Error:", errorMessage);
      toast.error(errorMessage, { autoClose: 10000 });

      // Make sure no navigation happens on error
      setOtpRequired(false); // Reset OTP if any
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otpCode) => {
    setLoadingOtp(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await API.post(
        "/verify-otp/",
        { code: otpCode },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("userRole", response.data.user.role);

      toast.success("OTP verified successfully!", { autoClose: 10000 });
      handleRoleRedirect(response.data.user.role);
    } catch (err) {
      console.error("OTP Error:", err);
      toast.error("Invalid OTP, please try again.", { autoClose: 15000 });
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleRoleRedirect = (role) => {
    // Handle invalid role scenario and stay on the login page
    if (role === "student") {
      navigate("/studdash");
    } else if (role === "lecturer") {
      navigate("/lectdash");
    } else if (role === "registrar") {
      navigate("/regdash");
    } else {
      toast.error("Invalid user role. Contact system admin.", {
        autoClose: 10000,
      });
      // Do NOT navigate — user stays on login
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
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your Username"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
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
              <p className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline dark:text-blue-500"
                >
                  Register
                </Link>
              </p>
              </div>
              <div className="mb-1">
                <p>
                  <Link
                    to="/forgot-password"
                    className=" text-blue-600 hover:underline dark:text-blue-700"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>
            </div>
          <div>
            <p>
              <Link
                to="/"
                className="text-blue-600 hover:underline dark:text-blue-700"
              >
                SIGN OUT
              </Link>
            </p>
          </div>
        </div>

        {/* OTP Modal */}
        {otpRequired && (
          <div className="otp-modal">
            <h2>Enter OTP</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              maxLength="6"
              className="otp-input"
            />
            {loadingOtp && <p>Verifying OTP...</p>}
          </div>
        )}
      </div>
      <div className="hidden md:block bg-blue-300 rounded-lg overflow-hidden">
          <img src={logo} alt="logo" className="h-100 w-80 " />
        </div>
    </div>
  );
}

export default Login;
