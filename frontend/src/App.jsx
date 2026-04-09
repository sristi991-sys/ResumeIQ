import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import Login from './pages/Login';
import CandidatePortal from './pages/CandidatePortal';
import HRDashboard from './pages/HRDashboard';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">
          <BrainCircuit className="text-accent" color="#6366f1" />
          <span>Resume<span className="gradient-text">IQ</span></span>
        </Link>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/candidate" element={<CandidatePortal />} />
          <Route path="/hr" element={<HRDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
