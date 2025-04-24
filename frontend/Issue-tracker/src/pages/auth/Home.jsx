import study from "../../assets/study.jpeg";
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold text-white">
              Academic Issue Tracking System
            </h1>
            <p className="text-sm text-gray-300">
              Manage and resolve student academic issues
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <button className="p-2">
                <span className="sr-only">Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" />
                </svg>
              </button>
              <p className="text-sm text-gray-300">Login</p>
            </Link>
          </div>
        </div>
      </header>
      <div
        className="flex-1 w-full"
        style={{
          backgroundImage: `url(${study})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "calc(100vh - 84px)", // Subtract header height - adjust 84px if your header height differs
        }}
      ></div>
    </div>
  );
};

export default Home;
