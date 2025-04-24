import API from "../../API";
import WrapL from "../../components/WrapL";
import {
  Search,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Bell,
  User,
  MoreHorizontal,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Lectdash = () => {
  //State for issues and filters
  const [allIssues, setAllIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statistics, setStatistics] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    assignedIssues: 0,
    resolvedIssues: 0,
  });
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await API.get("/api/issues/statistics/");
        console.log("Statistics API response:", response.data);

        setStatistics({
          totalIssues: response.data.total || 0,
          pendingIssues: response.data.in_progress || 0,
          assignedIssues: response.data.assigned || 0,
          resolvedIssues: response.data.resolved || 0,
        });
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        // Keep default values from state initialization if API fails
      }
    };

    fetchStatistics();
  }, []);

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
            subject: "Missing Marks for CSC102",
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

  // Apply filters when any filter changes
  useEffect(() => {
    // Ensure allIssues is an array before proceeding
    if (!Array.isArray(allIssues)) {
      setFilteredIssues([]);
      return;
    }

    let result = [...allIssues];

    try {
      // Apply tab filter
      if (activeTab === "urgent") {
        // Defining what makes an issue "urgent" - i.e:
        result = result.filter((issue) => {
          // Safely handle date parsing
          try {
            const submittedDate = new Date(issue.dateSubmitted);
            const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return issue.status === "Assigned" && submittedDate > cutoffDate;
          } catch (e) {
            console.error("Date parsing error:", e);
            return false; // Skip items with invalid dates
          }
        });
      } else {
        // For "recent" tab - sort by date with error handling
        result.sort((a, b) => {
          try {
            return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
          } catch (e) {
            console.error("Date sorting error:", e);
            return 0; // Maintain original order if date parsing fails
          }
        });
      }

      // Apply status filter
      if (statusFilter !== "All Statuses") {
        result = result.filter((issue) => issue.status === statusFilter);
      }

      // Apply type filter
      if (typeFilter !== "All Types") {
        result = result.filter((issue) => issue.issueType === typeFilter);
      }

      // Apply search query with better error handling for property access
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter((issue) => {
          // Handle both string and object student formats
          const studentName =
            typeof issue.student === "string"
              ? issue.student.toLowerCase()
              : issue.student?.name?.toLowerCase() || "";

          return (
            studentName.includes(query) ||
            (issue.subject?.toLowerCase() || "").includes(query)
          );
        });
      }
    } catch (err) {
      console.error("Error applying filters:", err);
      // If filtering fails, at least show something
      result = allIssues;
    }

    setFilteredIssues(result);
  }, [statusFilter, typeFilter, searchQuery, allIssues, activeTab]);
  
  // Reset filters
  const handleReset = () => {
    setStatusFilter("All Statuses");
    setTypeFilter("All Types");
    setSearchQuery("");
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await API.patch(`/api/issues/${issueId}/`, {
        status: newStatus,
      });

      // Update local state
      const updatedIssues = allIssues.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      );

      setAllIssues(updatedIssues);

      // Re-fetch statistics to keep them updated
      try {
        const statsResponse = await API.get("/api/issues/statistics/");
        setStatistics({
          totalIssues: statsResponse.data.total || 0,
          pendingIssues: statsResponse.data.in_progress || 0,
          assignedIssues: statsResponse.data.assigned || 0,
          resolvedIssues: statsResponse.data.resolved || 0,
        });
      } catch (statsErr) {
        console.error(
          "Failed to update statistics after status change:",
          statsErr
        );
        // Don't update statistics if the API call fails
      }

      setCookiesModalOpen(false);
    } catch (err) {
      console.error("Failed to update issue status:", err);
      // Show some feedback to the user
      setError("Failed to update issue status. Please try again.");
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  // Get badge color based on issue type
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

  // Loading state
  if (loading) {
    return (
      <WrapL>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </WrapL>
    );
  }

  return (
    <WrapL>
      <div>
        <header className="bg-blue-950 border-b border-gray-200  mb-2 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Lecturer Dashboard
              </h1>
              <p className="text-sm text-gray-300">
                Manage and resolve student academic issues
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute right-0 top-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </div>
                <button className="p-2">
                  <a>
                    <span className="sr-only">Notifications</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </a>
                </button>
              </div>
              <button className="p-2">
                <span className="sr-only">Account</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Display error message if exists */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {statistics?.totalIssues || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All issues assigned to you
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <FileText size={20} className="text-gray-600" />
            </div>
          </div>

          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Assigned</p>
              <p className="text-3xl font-bold text-white mt-1">
                {statistics?.assignedIssues || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Issues awaiting your action
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>

          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">In progress</p>
              <p className="text-3xl font-bold text-white mt-1">
                {statistics?.pendingIssues || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Issues you are currently working on
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Resolved Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {statistics?.resolvedIssues || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Issues you have successfully resolved
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        {/* Tab section for Recent/Urgent Issues */}
        <div className="flex justify-between items-center mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-700 ${
                activeTab === "recent"
                  ? "text-white bg-blue-950 hover:bg-blue-800"
                  : "text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("recent")}
            >
              Recent Issues
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-700 ${
                activeTab === "urgent"
                  ? "text-white bg-blue-950 hover:bg-blue-800"
                  : "text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setActiveTab("urgent")}
            >
              Urgent Issues
            </button>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-blue-500 hover:underline"
          >
            View all issues
          </a>
        </div>
        {/* Filter Section */}
        <div className="bg-blue-950 rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm  font-medium text-white mb-1">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300  bg-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>Submitted</option>
                  <option>Pending</option>
                  <option>Assigned</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Issue Type
                </label>
                <select
                  className="w-full border border-gray-300 bg-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Missing Marks</option>
                  <option>Registration</option>
                  <option>Grade Appeal</option>
                  <option>Attendance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Search
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by student name, ID, or description..."
                      className="w-full border border-gray-300 bg-white rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search size={16} />
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Issues Table */}
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
                                        <Link to = "/resolve">
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
                                          </Link>
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

export default Lectdash;
