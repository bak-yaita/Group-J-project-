import React from "react";
import Cards from "../../components/cards";
import { Link } from "react-router";
import Wrapper from "../../components/wrapper";

const Selectrole = () => {
  return (
    <Wrapper>
      <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white">
          <Link
            to="/login"
            class="text-blue-600 hover:underline dark:text-blue-500"
          >
            Back to login
          </Link>
        </h5>
        <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white ">
          Select your Role
        </h5>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400"></p>
        <ul class="my-4 space-y-3">
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Student</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Lecturer</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Registrar</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Admin</span>
            </a>
          </li>
        </ul>
      </div>
    </Wrapper>
  );
};

export default Selectrole;
