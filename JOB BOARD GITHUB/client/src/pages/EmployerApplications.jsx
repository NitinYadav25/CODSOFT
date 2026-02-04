import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Check, X, Clock } from 'lucide-react';

const EmployerApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    if (user?.role !== 'employer') {
      navigate('/');
      return;
    }
    fetchApplications();
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const response = await fetch('/api/applications/employer/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setApplications(data);
      }
    } catch (error) {
      // Silently fail - backend may not be running
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (appId, status) => {
    try {
      const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
      const response = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setApplications(applications.map(app => 
          app._id === appId ? { ...app, status } : app
        ));
        if (selectedApplication?._id === appId) {
          setSelectedApplication({ ...selectedApplication, status });
        }
      }
    } catch (error) {
      // Silently fail - backend may not be running
    }
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'shortlisted': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'accepted': return <Check size={16} />;
      case 'rejected': return <X size={16} />;
      case 'shortlisted': return <Check size={16} />;
      default: return <Clock size={16} />;
    }
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
          <h1 className="text-4xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-600">Manage and review job applications from candidates.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Filter Tabs */}
              <div className="border-b border-slate-100 p-4 flex gap-2 overflow-x-auto">
                {['all', 'pending', 'shortlisted', 'accepted', 'rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      filterStatus === status
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading applications...</div>
              ) : filteredApplications.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {filteredApplications.map(app => (
                    <div
                      key={app._id}
                      onClick={() => setSelectedApplication(app)}
                      className={`p-6 cursor-pointer hover:bg-slate-50 transition-colors ${
                        selectedApplication?._id === app._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <h3 className="font-semibold text-slate-900">{app.candidateName}</h3>
                          <p className="text-slate-600 text-sm">{app.jobTitle}</p>
                          <p className="text-slate-500 text-xs mt-1">{app.candidateEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(app.status)}`}>
                            {getStatusIcon(app.status)}
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No applications found for this filter.
                </div>
              )}
            </div>
          </div>

          {/* Application Details */}
          <div>
            {selectedApplication ? (
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden sticky top-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                  <h2 className="text-xl font-bold">{selectedApplication.candidateName}</h2>
                  <p className="text-blue-100 text-sm">{selectedApplication.jobTitle}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Candidate Info */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Candidate Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-slate-600">Email:</span> <a href={`mailto:${selectedApplication.candidateEmail}`} className="text-primary hover:underline">{selectedApplication.candidateEmail}</a></p>
                      <p><span className="text-slate-600">Applied:</span> {new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                      <p><span className="text-slate-600">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(selectedApplication.status)}`}>{selectedApplication.status}</span></p>
                    </div>
                  </div>

                  {/* Resume Download */}
                  {selectedApplication.resume && (
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Resume</h3>
                      <a href={selectedApplication.resume} download className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-900 font-medium text-sm transition-colors">
                        <Download size={16} />
                        Download Resume
                      </a>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Update Status</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'shortlisted')}
                        className="w-full px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'accepted')}
                        className="w-full px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                        className="w-full px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
                <p className="text-slate-500">Select an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerApplications;
