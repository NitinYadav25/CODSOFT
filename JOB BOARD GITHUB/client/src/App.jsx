import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Search, Briefcase, User, Menu, MapPin, LogOut } from 'lucide-react';
import JobCard from './components/JobCard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Companies from './pages/Companies';
import JobDetail from './pages/JobDetail';
import Jobs from './pages/Jobs';
import Home from './pages/Home';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerPostJob from './pages/EmployerPostJob';
import EmployerMyJobs from './pages/EmployerMyJobs';
import EmployerApplications from './pages/EmployerApplications';
import EmployerLanding from './pages/EmployerLanding';
import EmployerSignupForm from './pages/EmployerSignupForm';


const Navbar = () => {
    const { user, logout } = useAuth();
    
    const handleLogout = () => {
      logout();
      window.location.href = '/';
    };

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded text-white">
                <Briefcase size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">JobHive</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {user?.role === 'employer' ? (
                <>
                  <Link to="/employer/dashboard" className="font-medium text-slate-600 hover:text-primary">Dashboard</Link>
                  <Link to="/employer/post-job" className="font-medium text-slate-600 hover:text-primary">Post Job</Link>
                  <Link to="/employer/my-jobs" className="font-medium text-slate-600 hover:text-primary">My Jobs</Link>
                  <Link to="/employer/applications" className="font-medium text-slate-600 hover:text-primary">Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="font-medium text-slate-600 hover:text-primary">Find Jobs</Link>
                  <Link to="/companies" className="font-medium text-slate-600 hover:text-primary">Companies</Link>
                </>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                  <>
                    <span className="text-slate-900 font-medium">Hi, {user.name}</span>
                    {user.role === 'candidate' && (
                      <Link to="/jobs" className="text-slate-600 hover:text-primary font-medium">Browse Jobs</Link>
                    )}
                    <button onClick={handleLogout} className="text-slate-600 hover:text-red-500 font-medium flex items-center gap-1">
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
              ) : (
                  <>
                    <Link to="/login" className="text-slate-600 font-medium hover:text-primary">Sign In</Link>
                    <Link to="/signup" className="btn btn-primary">Sign Up</Link>
                  </>
              )}
            </div>
            
            <div className="md:hidden">
              <Menu size={24} className="text-slate-600" />
            </div>
          </div>
        </div>
      </nav>
    );
}


function App() {
  return (
    <Router>
        <AuthProvider>
            <div className="min-h-screen flex flex-col font-sans">
                <Navbar />
                <Routes>
                    {/* Candidate Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/companies" element={<Companies />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/employer-landing" element={<EmployerLanding />} />
                    <Route path="/employer-signup" element={<EmployerSignupForm />} />

                    {/* Employer Routes */}
                    <Route path="/employer/dashboard" element={<EmployerDashboard />} />
                    <Route path="/employer/post-job" element={<EmployerPostJob />} />
                    <Route path="/employer/my-jobs" element={<EmployerMyJobs />} />
                    <Route path="/employer/applications" element={<EmployerApplications />} />
                    <Route path="/employer/job/:id/applications" element={<EmployerApplications />} />
                </Routes>
                
                {/* Footer */}
                <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="text-white font-bold text-lg mb-4">JobHive</h4>
                        <p className="text-sm">Making job search easy and hiring simple.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">For Candidates</h4>
                        <ul className="space-y-2 text-sm">
                          <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                          <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm">
                          <li><Link to="/employer/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
                          <li><Link to="/employer/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                          <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                          <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate-700 text-center text-sm">
                      <p>&copy; 2026 JobHive. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </AuthProvider>
    </Router>
  );
}

export default App;
