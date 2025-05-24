import WrapL from "../../components/WrapL";
import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../API"; 


const Issues = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [cookiesModalOpen, setCookiesModalOpen] = useState(null);
  
    // Fetch all issues
      useEffect(() => {
        const fetchIssues = async () => {
          try {
            setLoading(true);
            const response = await API.get("/api/issues/");
            console.log("Issues API response:", response.data);
    
            // Handle both array and object responses properly
            const issues = Array.isArray(response.data)
              ? response.data
              : response.data.issues || [];
    
            setAllIssues(issues); //Set the processed issues array
            setFilteredIssues(issues);
          } catch (err) {
            setError("Failed to fetch issues");
            console.error("Failed to fetch issues:", err);
            // Use mock data if API fails
            const mockIssues = [
              {
                id: 1,
                subject: "Missing marks for John Doe",
                student: "John Doe", // Note: student is a string, not an object
                course: "CSC101",
                issueType: "Missing Marks",
                status: "Assigned",
                dateSubmitted: "4/2/2025",
              },
              // mock issues as fallback
            ];
            setAllIssues(mockIssues);
            setFilteredIssues(mockIssues);
          } finally {
            setLoading(false);
          }
        };
    
        fetchIssues();
      }, []);
  
  const getBadgeClass = (type) => {
    switch (type) {
      case "Missing Marks":
        return "bg-red-100 text-red-800";
      case "Grade Appeal":
        return "bg-blue-100 text-blue-800";
      case "Correction":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
    
  return (
    <WrapL>
      <div>
        <header className="bg-blue-950 border-b border-gray-200  mb-5 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                GENERAL ISSUES
              </h1>
              <p className="text-sm text-gray-300">
                Manage and resolve student academic issues
              </p>
            </div>
          </div>
        </header>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No issues found matching your criteria.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-950">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Subject
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Student
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Course
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Issue Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Date Submitted
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {issue.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {issue.student}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeClass(
                            issue.issueType
                          )}`}
                        >
                          {issue.issueType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.dateSubmitted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="m-1.5">
                          {/* Button to open the modal */}
                          <button
                            className="btn bg-gray-500 hover:bg-indigo-600 text-white p-2 rounded-2xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCookiesModalOpen(issue.id); // Stores the issue id in state
                            }}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {/* Modal structure, rendered conditionally based on state */}
                          {cookiesModalOpen === issue.id && (
                            <div
                              className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50 overflow-y-auto" // Added bg-black bg-opacity-50 for overlay
                              onClick={() => setCookiesModalOpen(false)} //  Close modal on overlay click
                            >
                              <div
                                className="relative p-4 w-full max-w-md max-h-full"
                                onClick={(e) => e.stopPropagation()} //Prevent closing when clicking inside modal
                              >
                                <div className="relative bg-white rounded-lg shadow-sm dark:bg-white border dark:border-gray-700">
                                  {/* Close button */}
                                  <button
                                    type="button"
                                    className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    onClick={() => setCookiesModalOpen(false)} // Close modal on button click
                                  >
                                    <svg
                                      className="w-3 h-3"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 14 14"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                      />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                  </button>

                                  {/* Modal content */}
                                  <div className="p-4 md:p-5 text-center">
                                    <svg
                                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-500*"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                      />
                                    </svg>
                                    <h3 className="mb-5 text-lg font-normal text-gray-700 dark:text-gray-700">
                                      What action do you want to do?
                                    </h3>
                                    <ul className="space-y-2 font-medium">
                                      <li>
                                        <Link
                                          to={`/viewdetails/${issue.id}`} // Added dynamic route parameter
                                          className="block"
                                        >
                                          <button className="w-full text-white bg-blue-950 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center justify-center px-5 py-2.5">
                                            View details
                                          </button>
                                        </Link>
                                      </li>
                                      <li>
                                        <button
                                          className="w-full text-white bg-blue-950 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center justify-center px-5 py-2.5"
                                          onClick={() =>
                                            updateIssueStatus(
                                              issue.id,
                                              "In Progress"
                                            )
                                          }
                                        >
                                          Mark as in Progress
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          className="w-full text-white bg-blue-950 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center justify-center px-5 py-2.5"
                                          onClick={() =>
                                            updateIssueStatus(
                                              issue.id,
                                              "Resolved"
                                            )
                                          }
                                        >
                                          Mark as Resolved
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </WrapL>
  );
};

export default Issues;