import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/home'
import ForgotPassword from './pages/forgot-password'
import Feed from './pages/feed'
import Help from './pages/help'
import Report from './pages/report'
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/help" element={<Help />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </Router>
      <Footer />
    </>
  )
}

export default App