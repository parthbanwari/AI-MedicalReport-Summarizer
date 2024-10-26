import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PDFUploader from './PDFUploader';
import Summary from './Summary';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/upload" element={<PDFUploader />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </Router>
  );
};

export default App;
