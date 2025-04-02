import { Link } from "react-router"
import React, { useState } from "react";
import issue from '../../assets/issue.jpg'

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "",
    user_number: "",
    college: "",
    password: "",
    registrationnumber:"",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();   //prevent the page fron reloading
    console.log(formData);
  };
  return (
    <div className="h-screen  flex  justify-center items-center bg-gray-100">
      <div className="bg-white p-4 flex gap-4 rounded-lg shadow-2xl ">
        <div>
          <h2 className="text-left mb-4 font-bold text-blue-400">Register</h2>
          <form onSubmit={handleSubmit}>
            <div class="mb-1">
              <label
                for="email"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            <div class="mb-1">
              <label
                for="username"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.name}
                placeholder="Enter your first and last name"
                onChange={handleChange}
                required
              />
            </div>
            <div class="mb-1">
              <label
                for="role"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.role}
                placeholder="Enter your role"
                onChange={handleChange}
                required
              />
            </div>
            <div class="mb-1">
              <label
                for="usernumber"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                User Number
              </label>
              <input
                type="text"
                id="usernumber"
                name="usernumber"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.user_number}
                placeholder="Enter your user number"
                onChange={handleChange}
                required
              />
            </div>
            <div class="mb-1">
              <label
                for="registrationnumber"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                Registration Number
              </label>
              <input
                type="text"
                id="registrationnumber"
                name="registrationnumber"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.registrationnumber}
                placeholder="Enter your user number"
                onChange={handleChange}
                required
              />
            </div>
            <div class="mb-1">
              <label
                for="college"
                class="block mb-2 text-sm text-left font-medium text-gray-600"
              >
                College
              </label>
              <input
                type="text"
                id="college"
                name="college"
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.college}
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-left  font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                password
                className="bg-gray-50 border border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={formData.pass}
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              class="text-white mt-4 mb-4 bg-blue-950 w-79  hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-400 font-medium rounded-lg text-sm  p-2.5 text-center "
            >
              R E G I S T E R
            </button>
          </form>
          <div>
            <div class="flex items-start mb-5">
              <label
                for="terms"
                class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                You have an account ?{" "}
                <Link
                  to={"/login"}
                  class="text-blue-600 hover:underline dark:text-blue-500"
                >
                  Login
                </Link>
              </label>
            </div>
          </div>
        </div>
        <div className="hidden md:block bg-blue-300 rounded-lg overflow-hidden">
          <img src={issue} alt="issue" className="h-full w-80 grayscale-100" />
        </div>
      </div>
    </div>
  );
}

export default Register;
