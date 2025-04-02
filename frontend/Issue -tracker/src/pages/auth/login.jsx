import React, { useState } from "react";
import issue from "../../assets/issue.jpg";
import { Link } from "react-router";
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

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
      const response = await axios.post("http://localhost", formData);
      console.log("Login successful:", response.data);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
    }
    catch (error) {
      console.error('Login failed:', err)
      setError(err.response?.data ?.message || 'Login failed. Please try again.');
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen  flex  justify-center items-center bg-gray-100">
      <div className="bg-white p-4 flex gap-3 rounded-lg shadow-2xl ">
        <div className="">
          <h2 className="text-left mb-4 font-bold text-blue-400">Login</h2>
         
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                for="name"
                className="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Name
              </label>
              <input
                type="text "
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
                className="block mb-2 text-sm text-left  font-medium text-gray-900"
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
            <button
              type="submit"
              className="text-white mt-4 mb-4 bg-blue-950 w-79  hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  p-2.5 text-center "
            >
              L O G I N
            </button>
          </form>
          <div>
            <div className="flex items-start mb-5">
              <label
                for="terms"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                You dont have an account ?{" "}
                <Link to="/register"
                  
                  className="text-blue-600 hover:underline dark:text-blue-500"
                >
                  Register
                </Link>
              </label>
            </div>
          </div>
        </div>
        <div className="hidden md:block bg-green-300 rounded-lg overflow-hidden">
          <img src={issue} alt="issue" className="h-full w-80 grayscale-100"/>
        </div>
      </div>
    </div>
  );
}

export default Login;
