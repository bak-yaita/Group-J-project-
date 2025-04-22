import WrapL from "../../components/WrapL";
import { Search, CheckCircle, Clock, Users, FileText, Bell, User, MoreHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const Lectdash = () => {
  //Mock data
  const initialIssues = [
    {
      subject: "Missing Marks for CSC102",
      student: "John Doe",
      course: "CSC101",
      issueType: "Missing Marks",
      status: "Assigned",
      dateSubmitted: "4/2/2025",
    },
    {
      subject: "Course Registration Error",
      student: "Jane Smith",
      course: "CSC101",
      issueType: "Registration",
      status: "In progress6",
      dateSubmitted: "4/1/2025",
    },
    {
      subject: "Grade Appeal for PHY201",
      student: "Alex Johnson",
      course: "MTH201",
      issueType: "Grade Appeal",
      status: "Assigned",
      dateSubmitted: "3/28/2025",
    },
    {
      subject: "Missing Attendance Record",
      student: "Sam Taylor",
      course: "CSK124",
      issueType: "Attendance",
      status: "Resolved",
      dateSubmitted: "3/25/2025",
    },
  ];
  //State for issues and filters
  const [allIssues, setAllIssues] = useState(initialIssues);
  const [filteredIssues, setFilteredIssues] = useState(initialIssues);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");

  // Calculate dashboard statistics
  const totalIssues = allIssues.length;
  const pendingIssues = allIssues.filter(
    (issue) => issue.status === "In Progress"
  ).length;
  const assignedIssues = allIssues.filter(
    (issue) => issue.status === "Assigned"
  ).length;
  const resolvedIssues = allIssues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  // Apply filters when any filter changes
  useEffect(() => {
    let result = [...allIssues];

    // Apply tab filter
    if (activeTab === "urgent") {
      // Define what makes an issue "urgent" - for example:
      result = result.filter(
        (issue) =>
          issue.status === "Assigned" &&
          new Date(issue.dateSubmitted) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
    } else {
      // For "recent" tab - sort by date
      result.sort(
        (a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
      );
    }

    // Apply status filter
    if (statusFilter !== "All Statuses") {
      result = result.filter((issue) => issue.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "All Types") {
      result = result.filter((issue) => issue.issueType === typeFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (issue) =>
          issue.student.name.toLowerCase().includes(query) ||
          issue.subject.toLowerCase().includes(query)
      );
    }

    setFilteredIssues(result);
  }, [statusFilter, typeFilter, searchQuery, allIssues]);

  // Reset filters
  const handleReset = () => {
    setStatusFilter("All Statuses");
    setTypeFilter("All Types");
    setSearchQuery("");
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {totalIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                All issues assinged to you
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
                {assignedIssues}
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
                {pendingIssues}
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
                {resolvedIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                issues you have successfully resolved
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
                            setCookiesModalOpen(true); // ALTERATION: Opens modal by setting state
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#e3e3e3"
                          >
                            <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                          </svg>
                        </button>

                        {/* Modal structure, rendered conditionally based on state */}
                        {cookiesModalOpen && (
                          <div
                            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full  overflow-y-auto" // ALTERATION: Overlay with proper styling
                            onClick={() => setCookiesModalOpen(false)} // ALTERATION: Close modal on overlay click
                          >
                            <div
                              className="relative p-4 w-full max-w-md max-h-full"
                              onClick={(e) => e.stopPropagation()} // ALTERATION: Prevent closing when clicking inside modal
                            >
                              <div className="relative bg-white rounded-lg shadow-sm dark:bg-white border dark:border-gray-700">
                                {/* Close button */}
                                <button
                                  type="button"
                                  className="absolute top-3 right-2.5 text-gray-700 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                  onClick={() => setCookiesModalOpen(false)} // ALTERATION: Close modal on button click
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
                                      <Link to="/viewdetails">
                                        <button
                                          className="text-white bg-blue-950 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                          // onClick={() => {
                                          //   console.log(
                                          //     `View details for issue: ${issue.subject}`
                                          //   ); // ALTERATION: Placeholder action
                                          //   setCookiesModalOpen(false); // Close modal
                                          // }}
                                        >
                                          View details
                                        </button>
                                      </Link>
                                    </li>
                                    <li>
                                      <button
                                        className="text-white bg-blue-950 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                        onClick={() => {
                                          console.log(
                                            `Mark as in Progress for issue: ${issue.subject}`
                                          ); // ALTERATION: Placeholder action
                                          setCookiesModalOpen(false); // Close modal
                                        }}
                                      >
                                        Mark as in Progress
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        className="text-white bg-blue-950 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                                        onClick={() => {
                                          console.log(
                                            `Mark as Resolved for issue: ${issue.subject}`
                                          ); // ALTERATION: Placeholder action
                                          setCookiesModalOpen(false); // Close modal
                                        }}
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
          </div>
        </div>
      </div>
    </WrapL>
  );
};

export default Lectdash;