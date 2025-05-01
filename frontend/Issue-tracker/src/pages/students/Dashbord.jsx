import API from "../../API";
import Cards from "../../components/Cards";
import Wrapper from "../../components/wrapper";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";


const StudentDashboard = () => {
    const [allIssues, setAllIssues] = useState();
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [statistics, setStatistics] = useState({
        totalIssues: 0,
        pendingIssues: 0,
        resolvedIssues: 0,
    });
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const handleReset = () => {
        setStatusFilter("All Statuses");
        setTypeFilter("All Types");
        setSearchQuery("");
        setFilteredIssues(allIssues); // Reset to all issues
    };

    //Fetching statistics
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await API.get("/api/issues/statistics/");
                console.log("Statistics for Dashboard:", response.data);
                setStatistics({
                    totalIssues: response.data.total || 0,
                    pendingIssues: response.data.pending || 0,
                    assignedIssues: response.data.assigned || 0,
                    resolvedIssues: response.data.resolved || 0,
                });
            } catch (err) {
                console.error("Failed to fetch statistics:", err);
            }
        };
        fetchStatistics();
    }, []);
    
    //Fetching issues
    useEffect(() => {
      // Modify the fetchIssues function to use your API import and the specified endpoints
      const fetchIssues = async () => {
        try {
          setLoading(true);

          // Start with the base endpoint
          let endpoint = "/api/issues/";
          let queryParams = [];

          // Add status filter parameter if selected
          if (statusFilter !== "All Statuses") {
            queryParams.push(`status=${statusFilter}`);
          }

          // Add issue type filter parameter if selected
          if (typeFilter !== "All Types") {
            queryParams.push(`issue_type=${typeFilter}`);
          }

          // Add description search parameter if there's a search query
          if (searchQuery.trim() !== "") {
            queryParams.push(
              `description=${encodeURIComponent(searchQuery.trim())}`
            );
          }

          // Append all query parameters to the endpoint
          if (queryParams.length > 0) {
            endpoint += "?" + queryParams.join("&");
          }

          console.log("Fetching from endpoint:", endpoint);

          // Use the imported API object to make the request
          const response = await API.get(endpoint);
          console.log("Issues from API:", response.data);

          const issues = Array.isArray(response.data)
            ? response.data
            : response.data.issues || [];

          setAllIssues(issues);
          setFilteredIssues(issues);
        } catch (err) {
          setError("Failed to fetch issues");
          console.error("Failed to fetch issues:", err);

          // Mock data for testing
          const mockIssues = [
            {
              id: 1,
              course_code: "CS101",
              issue_type: "Missing Marks",
              status: "Pending",
              last_update: "2023-10-01",
            },
            {
              id: 2,
              course_code: "CS102",
              issue_type: "Registration",
              status: "Resolved",
              last_update: "2023-09-15",
            },
          ];
          setAllIssues(mockIssues);
          setFilteredIssues(mockIssues);
        } finally {
          setLoading(false);
        }
      };
      fetchIssues();
    }, []);

    useEffect(() => {
        if (!Array.isArray(allIssues)) {
            setFilteredIssues([]);
            return;
        }
        let result = [...allIssues];

        try {
            if (statusFilter !== "All Statuses") {
                result = result.filter((issue) => issue.status === statusFilter);
            }
            if (typeFilter !== "All Types") {
                result = result.filter((issue) => issue.issue_type === typeFilter);
            }
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                result = result.filter(issue =>
                    (issue.student_name && issue.student_name.toLowerCase().includes(query)) ||
                    (issue.student_id && issue.student_id.toLowerCase().includes(query)) ||
                    (issue.description && issue.description.toLowerCase().includes(query))
                );
            }
                
        
            setFilteredIssues(result);
        } catch (err) {
            console.error("Error filtering issues:", err);
        }
    },
   [allIssues, statusFilter, typeFilter, searchQuery]);
  return (
    <Wrapper>
      <div className="m-2">
        <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-sm text-gray-300">Have your issues resolved</p>
          </div>
        </header>
        <div className="mt-4 mb-4 flex flex-col gap-2 md:flex-row flexgap-4 md:justify-between">
          <Cards
            title="Total Issues"
            number={statistics.totalIssues}
            text="The Total Number of Issues You Have"
          />
          <Cards
            title="Pending Issues"
            number={statistics.pendingIssues}
            text="The Number of Your Unresolved Issues"
          />
          <Cards
            title="Resolved Issues"
            number={statistics.resolvedIssues}
            text="The Number of Your Resolved Issues"
          />
        </div>
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

        <div className="space-y-4">
          <p className="text-2xl font">Recent Issues</p>
          <div className="relative overflow-x-auto shadow-md ">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-blue-950 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Issue ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Course Code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Issue Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last Update
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody> {loading ? (
                <tr>
            <td colSpan="6" className="px-6 py-4 text-center">
              Loading...
            </td>
          </tr>
        ) : filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            <tr key={issue.id} className="bg-white border-b dark:bg-white dark:border-gray-700 border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700"
              >
                {issue.id}
              </th>
              <td className="px-6 py-4">{issue.course_code}</td>
              <td className="px-6 py-4">{issue.issue_type}</td>
              <td className="px-6 py-4">{issue.status}</td>
              <td className="px-6 py-4">{issue.last_update}</td>
              <td className="px-6 py-4">
                    <a
                      href={`/issues/${issue.id}`}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="px-6 py-4 text-center">
              No issues found
            </td>
          </tr>
        )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default StudentDashboard;