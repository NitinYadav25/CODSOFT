import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, Users, FileText, TrendingUp, Plus, Eye, Trash2 } from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    jobsPosted: 0,
    totalApplications: 0,
    activeJobs: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'employer') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      
      // Fetch jobs posted by employer
      const jobsResponse = await fetch('/api/jobs/employer/my-jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const jobsData = await jobsResponse.json();
      
      if (jobsResponse.ok) {
        setRecentJobs(jobsData.slice(0, 5));
        setStats(prev => ({
          ...prev,
          jobsPosted: jobsData.length,
          activeJobs: jobsData.filter(j => j.status === 'active').length
        }));
      }
    } catch (error) {
      // Silently fail - backend may not be running
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setRecentJobs(recentJobs.filter(j => j._id !== jobId));
          setStats(prev => ({...prev, jobsPosted: prev.jobsPosted - 1}));
        }
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">You must be an employer to access this dashboard</p>
          <Link to="/" className="btn btn-primary">Go Back Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Employer Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user?.name}! Manage your job postings and applications.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Jobs Posted</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.jobsPosted}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase size={32} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalApplications}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users size={32} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Listings</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.activeJobs}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <Link to="/employer/post-job" className="btn btn-primary py-3 flex items-center justify-center gap-2 hover:shadow-lg transition-shadow">
            <Plus size={20} />
            Post New Job
          </Link>
          <Link to="/employer/my-jobs" className="btn btn-outline py-3 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <Briefcase size={20} />
            My Jobs
          </Link>
          <Link to="/employer/applications" className="btn btn-outline py-3 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <FileText size={20} />
            Applications
          </Link>
          <Link to="/employer/analytics" className="btn btn-outline py-3 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <TrendingUp size={20} />
            Analytics
          </Link>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900">Recent Job Postings</h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading jobs...</div>
          ) : recentJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-900">Job Title</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-900">Applications</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-900">Posted Date</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-8 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 font-medium text-slate-900">{job.title}</td>
                      <td className="px-8 py-4 text-slate-600">{job.location}</td>
                      <td className="px-8 py-4 text-slate-600">{job.applications || 0}</td>
                      <td className="px-8 py-4 text-slate-600">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                          {job.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-8 py-4 flex gap-2">
                        <Link to={`/jobs/${job._id}`} className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="View Job">
                          <Eye size={18} className="text-slate-600" />
                        </Link>
                        <Link to={`/employer/job/${job._id}/applications`} className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title="View Applications">
                          <FileText size={18} className="text-slate-600" />
                        </Link>
                        <button onClick={() => handleDeleteJob(job._id)} className="p-2 hover:bg-red-100 rounded-lg transition-colors" title="Delete Job">
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <p>No jobs posted yet.</p>
              <Link to="/employer/post-job" className="text-primary font-semibold mt-2 inline-block">Post your first job</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
