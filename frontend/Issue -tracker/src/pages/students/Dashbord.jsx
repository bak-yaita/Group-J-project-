import API from "../../API";
import Cards from "../../components/cards";
import Wrapper from "../../components/wrapper";
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
        const fetchIssues = async () => {
            try {
                setLoading(true);
                const response = await API.get('/api/issues/')
                console.log("Issues from api;", response.data)
                const issues = Array.isArray(response.data)
                    ? response.data
                    : response.data.issues || [];

            setAllIssues(issues); //Set the processed issues array
            setFilteredIssues(issues);
            } catch (err) {
                setError("Failed to fetch issues");
                console.error("Failed to fetch issues:", err);  
            }
        }
    })
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
            number="12"
            text="The Total Number of Issues You Have"
          />
          <Cards
            title="Pending Issues"
            number="12"
            text="The Number of Your Unresolved Issues"
          />
          <Cards
            title="Resolved Issues"
            number="12"
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
                    Issue_id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Course_code
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Issue_type
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Last_update
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-white dark:border-gray-700 border-gray-200">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Apple MacBook Pro 17"
                  </th>
                  <td className="px-6 py-4">Silver</td>
                  <td className="px-6 py-4">Laptop</td>
                  <td className="px-6 py-4">$2999</td>
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default StudentDashboard;
