import React from "react";
import Wrapper from "../../components/wrapper";


const Profsettings = () => {
  return (
    <Wrapper>
      <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <h5 class="mb-3 text-base font-semibold text-gray-900 md:text-xl dark:text-white text-center">
          Profile Settings
        </h5>
        <p class="text-sm font-normal text-gray-500 dark:text-gray-400"></p>
        <ul class="my-4 space-y-3">
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">
                Update profile picture
              </span>
            </a>
          </li>
          <li> 
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Edit Name</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Change Email</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              class="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            >
              <span class="flex-1 ms-3 whitespace-nowrap">Change Password</span>
            </a>
          </li>
        </ul>
        <button
          type="submit"
          class="text-white mt-4 mb-4 bg-blue-950 w-79  hover:bg-blue-950 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  p-2.5 text-center "
        >
         SAVE CHANGES 
        </button>
      </div>
    </Wrapper>
  );
};

export default Profsettings;
