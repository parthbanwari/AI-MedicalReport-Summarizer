import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import html2pdf from 'html2pdf.js';

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get summary data from the location state (fallback in case data is missing)
  const summary = location.state?.summary || "No summary data available.";

  // Convert summary to array if it's a string with line breaks, otherwise use it as is
  const summaryPoints = typeof summary === 'string' ? summary.split('\n') : summary;

  const downloadPDF = () => {
    const element = document.getElementById('summary-content');
    const options = {
      margin: 1,
      filename: 'summary.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(options)
      .save();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-6">Hi Archit</h1>

      {/* Subheading */}
      <h2 className="text-2xl font-semibold mb-4">Your Medical Report Summary is:</h2>

      {/* Card */}
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Medical Summary</CardTitle>
        </CardHeader>
        
        <CardContent id="summary-content">
          {Array.isArray(summaryPoints) ? (
            <ul className="list-disc list-inside space-y-2 text-lg">
              {summaryPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">{summary}</p>
          )}
        </CardContent>
      </Card>

      {/* Buttons to go back to Upload Page and download PDF */}
      <div className="flex justify-center mt-6 space-x-4">
        <Button 
          onClick={() => navigate("/upload")} 
          className="rounded-xl bg-red-500 text-black hover:bg-white transition-colors"
        >
          Upload Another Report
        </Button>
        
        <Button 
          onClick={downloadPDF} 
          className="rounded-xl bg-red-500 text-black hover:bg-white transition-colors"
        >
          Download Summary 
        </Button>
      </div>
    </div>
  );
};

export default Summary;
