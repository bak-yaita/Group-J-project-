import Model from "../../components/model";
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
import { Link } from "react-router";

const AcademicRegistrarDashboard = () => {
  // Mock data for the dashboard
  const initialIssues = [
    {
      id: 1,
      student: { name: "John Doe", id: "2020/HD05/1234B" },
      subject: "Missing Marks for CSC102",
      issueType: "Missing Marks",
      status: "Submitted",
      dateSubmitted: "4/2/2025",
      assignedTo: "Not Assigned",
    },
    {
      id: 2,
      student: { name: "Jane Smith", id: "2021/HD06/5678C" },
      subject: "Course Registration Error",
      issueType: "Registration",
      status: "Pending",
      dateSubmitted: "4/1/2025",
      assignedTo: "Not Assigned",
    },
    {
      id: 3,
      student: { name: "Alex Johnson", id: "2019/HD04/9012D" },
      subject: "Grade Appeal for PHY201",
      issueType: "Grade Appeal",
      status: "Assigned",
      dateSubmitted: "3/28/2025",
      assignedTo: "Dr. Wilson",
    },
    {
      id: 4,
      student: { name: "Sam Taylor", id: "2022/HD07/3456E" },
      subject: "Missing Attendance Record",
      issueType: "Attendance",
      status: "Resolved",
      dateSubmitted: "3/25/2025",
      assignedTo: "Prof. Garcia",
    },
  ];

  // State for issues and filters
  const [allIssues, setAllIssues] = useState(initialIssues);
  const [filteredIssues, setFilteredIssues] = useState(initialIssues);
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [cookiesModalOpen, setCookiesModalOpen] = useState(false);

  // Calculate dashboard statistics
  const totalIssues = allIssues.length;
  const pendingIssues = allIssues.filter(
    (issue) => issue.status === "Pending"
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
          issue.student.id.toLowerCase().includes(query) ||
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Academic Registrar Dashboard
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
              </button>
            </div>
            <Link to="/rprofile">
              <button className="p-2">
                <span className="sr-only">Profile</span>
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
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-8">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Total Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {totalIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">All submitted issues</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <FileText size={20} className="text-gray-600" />
            </div>
          </div>

          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Pending Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {pendingIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Awaiting assignment or resolution
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Assigned Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {assignedIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Assigned to lecturers
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users size={20} className="text-purple-600" />
            </div>
          </div>

          <div className="bg-blue-950 rounded-lg shadow p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white">Resolved Issues</p>
              <p className="text-3xl font-bold text-white mt-1">
                {resolvedIssues}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Successfully resolved
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-blue-950 rounded-lg shadow mb-8">
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">
              Filter Issues
            </h2>

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
                    ID
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
                    Subject
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
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Assigned To
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
                      {issue.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {issue.student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {issue.student.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.subject}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {issue.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="m-1.5">
                        {/* Start */}
                        <button
                          className="btn bg-gray-500 hover:bg-indigo-600 text-white p-2 rounded-2xl"
                          aria-controls="cookies-modal"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCookiesModalOpen(true);
                          }}
                        >
                          Action
                        </button>
                        <Model
                          id="cookies-modal"
                          modalOpen={cookiesModalOpen}
                          setModalOpen={setCookiesModalOpen}
                          title="View Details"
                        >
                          <div className="text-sm mb-5">
                            <div className="space-y-2">
                              <Link to="/assign">
                                <button
                                  type="button"
                                  className="py-2.5 w-full px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                  Assign to lecturer
                                </button>
                              </Link>
                              
                              <button
                                type="button"
                                className="py-2.5 w-full px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                              >
                                Resolve
                              </button>
                            </div>
                          </div>
                        </Model>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AcademicRegistrarDashboard;
