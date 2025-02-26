import React, { useState } from "react";
import issue from "../../assets/issue.jpg";
import { Link } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    email:" ",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <div className="h-screen  flex  justify-center items-center bg-gray-100">
      <div className="bg-white p-4 flex gap-3 rounded-lg shadow-2xl ">
        <div className="">
          <h2 className="text-left mb-4 font-bold text-blue-400">Login</h2>
          <form onSubmit={handleSubmit}>
            <div class="mb-5">
              <label
                for="email"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.email}
                placeholder="Enter your email"
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
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              class="text-white mt-4 mb-4 bg-green-700 w-79  hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm  p-2.5 text-center "
            >
              L O G I N
            </button>
          </form>
          <div>
            <div class="flex items-start mb-5">
              <label
                for="terms"
                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                You dont have an account ?{" "}
                <Link to="/register"
                  
                  class="text-blue-600 hover:underline dark:text-blue-500"
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
