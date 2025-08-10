import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BootSequence from "./components/BootSequence";
import SearchEngine from "./components/SearchEngine";

function App() {
  const [isBooted, setIsBooted] = useState(false);

  const handleBootComplete = () => {
    setIsBooted(true);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-black overflow-hidden">
              {!isBooted ? (
                <BootSequence onBootComplete={handleBootComplete} />
              ) : (
                <SearchEngine />
              )}
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;