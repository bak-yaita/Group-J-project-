import api from "../../API";
import WrapL from "../../components/WrapL";
import { Clock, User, CalendarDays, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";


const Details = () => {

    const { id } = useParams();
    const navigate = useNavigate();
     const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      const fetchIssueDetails = async () => {
        setLoading(true);
        try {
          // Corrected API call syntax (use `id` in the URL)
          const response = await api.get(`/api/issues/${id}/`); // Fixed template literal syntax

          if (!response.ok) {
            throw new Error(`Error fetching issue: ${response.status}`);
          }

          const data = await response.json();
          setIssue(data);
        } catch (err) {
          setError(err.message);
          console.error("Failed to fetch issue details:", err);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        fetchIssueDetails();
      }
    }, [id]);

   const handleStatusUpdate = async (newStatus) => {
     try {
       // Corrected API call for updating status
       const response = await api.patch(`/api/issues/${id}/`, {
        
         body: JSON.stringify({ status: newStatus }),
       });

       if (!response.ok) {
         throw new Error(`Error updating status: ${response.status}`);
       }

       const updatedData = await response.json();
       setIssue(updatedData); // Update with full response to ensure consistency
     } catch (err) {
       console.error("Failed to update issue status:", err);
       // Optionally show a notification to the user
     }
   };
  if (loading) {
    return (
      <WrapL>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </WrapL>
    );
  }
//error state
  if (error) {
    return (
      <WrapL>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </WrapL>
    );
  }
//when issue not found
  if (!issue) {
    return (
      <WrapL>
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-500">Issue not found</div>
        </div>
      </WrapL>
    );
  }

  const getTypeBadgeClass = (type) => {
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

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Assigned":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <WrapL>
      <div className="bg-black min-h-screen text-white">
        {/* Header */}
        <div className="p-4 flex items-center space-x-4 border-b border-gray-800">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-md hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{issue.subject}</h1>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeBadgeClass(issue.issueType)}`}>
              {issue.issueType}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Issue Details - Left column (spans 2 columns on medium screens) */}
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Issue Details</h2>
              <p className="text-gray-400 mb-6">Course: {issue.course} - {issue.courseCode || issue.course}-2023</p>
              
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300 mb-6">{issue.description}</p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusBadgeClass(issue.status)}`}>
                  <span>{issue.status}</span>
                </div>

                {issue.status !== "In Progress" && (
                  <button 
                    onClick={() => handleStatusUpdate("In Progress")}
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    <Clock size={18} />
                    <span>Mark as In Progress</span>
                  </button>
                )}

                {issue.status !== "Resolved" && (
                  <button 
                    onClick={() => handleStatusUpdate("Resolved")}
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
                  >
                    <CheckCircle size={18} />
                    <span>Resolve Issue</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Student Information - Right column */}
          <div className="md:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Student Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <User size={20} className="text-gray-400" />
                  <span>{issue.student}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-gray-400" />
                  <span>Reg: {issue.regNumber || "2023/CSC/001"}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarDays size={20} className="text-gray-400" />
                  <span>Year {issue.year || "1"}, Semester {issue.semester || "2"}</span>
                </div>
                
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Submitted:</span>
                      <span>{issue.dateSubmitted}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Updated:</span>
                      <span>{issue.lastUpdated || "Mar 21, 2023, 05:15 PM"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrapL>
  )
}

export default Details