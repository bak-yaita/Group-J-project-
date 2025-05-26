import API from "../../API";
import Cards from "../../components/Cards";
import Wrapper from "../../components/wrapper";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";


const StudentDashboard = () => {
    const [allIssues, setAllIssues] = useState();
    const [statistics, setStatistics] = useState({
        totalIssues: 0,
        pendingIssues: 0,
        resolvedIssues: 0,
    });
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
      // Modify the fetchIssues function to use your API import and the specified endpoints
      const fetchIssues = async () => {
        try {
          setLoading(true);

          // Start with the base endpoint
          let endpoint = "/api/issues/";
          let queryParams = [];

          
          console.log("Fetching from endpoint:", endpoint);

          // Use the imported API object to make the request
          const response = await API.get(endpoint);
          console.log("Issues from API:", response.data);

          const issues = Array.isArray(response.data)
            ? response.data
            : response.data.issues || [];

          setAllIssues(issues);
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
        } finally {
          setLoading(false);
        }
      };
      fetchIssues();
    }, []);

    
  return (
    <Wrapper>
      <div className="m-2">
        <header className="bg-blue-950 border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-sm text-gray-300">Have your issues resolved</p>
          </div>
              <div className="relative">
                <Link to="/notifications">
                  <button className="p-2">
                    <a>
                      <span className="sr-only">Notifications</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#e3e3e3"
                      >
                        <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
                      </svg>
                    </a>
                  </button>
                </Link>
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