import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Eye, Users } from 'lucide-react';

const EmployerMyJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    if (user?.role !== 'employer') {
      navigate('/');
      return;
    }
    fetchEmployerJobs();
  }, [user, navigate]);

  const fetchEmployerJobs = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const response = await fetch('/api/jobs/employer/my-jobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setJobs(data);
      }
    } catch (error) {
      // Silently fail - backend may not be running
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          setJobs(jobs.filter(job => job._id !== jobId));
        } else {
          alert('Failed to delete job');
        }
      } catch (error) {
        // Silently fail - backend may not be running
        alert('Error deleting job');
      }
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const newStatus = currentStatus === 'active' ? 'closed' : 'active';
      
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setJobs(jobs.map(job => 
          job._id === jobId ? { ...job, status: newStatus } : job
        ));
      }
    } catch (error) {
      // Silently fail - backend may not be running
    }
  };

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    closed: jobs.filter(j => j.status === 'closed').length,
    totalApplications: jobs.reduce((sum, job) => sum + (job.applications || 0), 0)
  };

  if (user?.role !== 'employer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Unauthorized access</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/employer/dashboard" className="flex items-center gap-2 text-primary hover:text-blue-700 mb-6">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">My Job Postings</h1>
              <p className="text-slate-600">Manage all your job listings</p>
            </div>
            <Link to="/employer/post-job" className="btn btn-primary">Post New Job</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-slate-100">
            <p className="text-slate-600 text-sm">Total Jobs</p>
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100">
            <p className="text-slate-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100">
            <p className="text-slate-600 text-sm">Closed</p>
            <p className="text-2xl font-bold text-slate-600">{stats.closed}</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100">
            <p className="text-slate-600 text-sm">Applications</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-primary'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading jobs...</div>
          ) : filteredJobs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Job Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Applications</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Posted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{job.title}</td>
                      <td className="px-6 py-4 text-slate-600">{job.location}</td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {job.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <Link to={`/employer/job/${job._id}/applications`} className="flex items-center gap-1 text-primary hover:underline">
                          <Users size={16} />
                          {job.applications || 0}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(job._id, job.status)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {job.status || 'Active'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link to={`/jobs/${job._id}`} title="View Job" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <Eye size={18} className="text-slate-600" />
                          </Link>
                          <Link to={`/employer/edit-job/${job._id}`} title="Edit Job" className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                            <Edit2 size={18} className="text-slate-600" />
                          </Link>
                          <button onClick={() => handleDeleteJob(job._id)} title="Delete Job" className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-500 mb-4">No jobs posted yet</p>
              <Link to="/employer/post-job" className="btn btn-primary">Post Your First Job</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerMyJobs;
