import React, { useState, useRef } from "react";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/upload", { // Corrected endpoint
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed");

      const result = await response.json();
      setSummary(result.summary);

      // Navigate to the summary page and pass the summary data via state
      navigate("/summary", { state: { summary: result.summary } });

    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Upload your medical report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          >
            {file ? (
              <div className="flex items-center justify-center space-x-2">
                <FileIcon className="h-6 w-6 text-primary" />
                <span className="font-medium text-sm text-gray-600">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-gray-500">PDF files only</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </CardContent>
        <div className="flex justify-center mb-4">
          <Button onClick={handleUpload} disabled={!file} className="rounded-xl bg-red-500">
            Upload
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FileUpload;
