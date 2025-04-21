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

const Lectdash = () => {
  //Mock data
  const initialIssues = [
    {
      subject: "Missing Marks for CSC102",
      student: "John Doe",
      course: "CSC101",
      issueType: "Missing Marks",
      status: "Submitted",
      dateSubmitted: "4/2/2025",
    },
    {
      subject: "Course Registration Error",
      student: "Jane Smith",
      course: "CSC101",
      issueType: "Registration",
      status: "Pending",
      dateSubmitted: "4/1/2025",
      assignedTo: "Not Assigned",
    },
    {
      subject: "Grade Appeal for PHY201",
      student: "Alex Johnson",
      course: "MTH201",
      issueType: "Grade Appeal",
      status: "Assigned",
      dateSubmitted: "3/28/2025",
      assignedTo: "Dr. Wilson",
    },
    {
      subject: "Missing Attendance Record",
      student: "Sam Taylor",
      course: "CSK124",
      issueType: "Attendance",
      status: "Resolved",
      dateSubmitted: "3/25/2025",
      assignedTo: "Prof. Garcia",
    },
  ];
  //State for issues and filters
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
      </div>
      <div>
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
      </div>
    </WrapL>
  );
};

export default Lectdash;