import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CandidatePortal from './pages/candidate/CandidatePortal'
import HRDashboard from './pages/hr/HRDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/candidate" element={<CandidatePortal />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App