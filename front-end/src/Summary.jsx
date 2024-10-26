import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get summary data from the location state (fallback in case data is missing)
  const summary = location.state?.summary || "No summary data available.";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-6">Hi Archit</h1>
      
      {/* Subheading */}
      <h2 className="text-2xl font-semibold mb-4">Your Medical Report Summary is:</h2>
      
      {/* Card */}
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl mx-auto">
        
        {/* Card Header */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold">Medical Summary</h3>
        </div>
        
        {/* Card Content */}
        <div className="px-6 py-4">
          <p className="text-lg">
            {summary}
          </p>
        </div>
      </div>

      {/* Button to go back to Upload Page */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/upload")}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          Upload Another Report
        </button>
      </div>
    </div>
  );
};

export default Summary;
