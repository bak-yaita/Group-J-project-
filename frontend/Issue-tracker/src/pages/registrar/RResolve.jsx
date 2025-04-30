import React, {useState} from "react";
import { Link } from "react-router-dom";

const Resolve = () => {
  const [formData, setFormData] = useState({
    resolutionDetails: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    try {
      const response = await API.post("/api/issues/{id}/resolve/", formData);
      console.log("Submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Link to="/regdash">
            <button className="p-2 bg-blue-950 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out">
              <span className="sr-only"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Resolve Issue</h1>
          </div>
        </div>
      </header>
      <div className="bg-blue-950 rounded-lg shadow mb-1">
        <div className="p-6">
          <h2 className="text-lg  font-medium text-white mb-4">
            Resolution Details
          </h2>
          <h4 className="text-white mb-7">
            Provide details about how the issue was resolved
          </h4>
        </div>
        <div className="px-6 py-4">
          <textarea
            id="resolutionDetails"
            name="resolutionDetails"
            value={formData.resolutionDetails}
            onChange={handleChange}
            rows="6"
            className="w-full h-32 p-2 border border-gray-300 rounded-lg"
            placeholder="Enter resolution details here..."
          ></textarea>
        </div>
      </div>
      <div className="bg-blue-950 rounded-lg shadow mb-1">
        <div className="flex mt-4 md:mt-6">
          <Link
            to="/regdash"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-500 dark:bg-gray-900 dark:hover:bg-gray-500 dark:focus:ring-gray-500"
          >
            Cancel
          </Link>
          <button onClick={handleSubmit} type="submit" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            Mark as resolved 
          </button>
            <div
              id="default-modal"
              tabIndex="-1"
              aria-hidden="true"
              className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
            >
              <div className="relative p-4 w-full max-w-2xl max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Issue resolved
                    </h3>
                    <p className="text-gray-900">The issue has been successfully ressolved</p>
                  </div >
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Resolve;
