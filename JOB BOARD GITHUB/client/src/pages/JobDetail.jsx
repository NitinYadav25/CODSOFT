import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building2, ChevronLeft, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Application State
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Job not found');
      const data = await response.json();
      setJob(data);
    } catch (err) {
      setError('Job not found or server unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setUploadError('File size too large (Max 5MB)');
            setResume(null);
        } else {
            setUploadError('');
            setResume(file);
        }
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to apply!");
        return;
    }
    if (!resume) {
        setUploadError('Please upload your resume');
        return;
    }

    setApplying(true);
    const formData = new FormData();
    formData.append('jobId', id);
    formData.append('userId', user._id);
    formData.append('resume', resume);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData, // Auto-sets Content-Type to multipart/form-data
      });

      const data = await response.json();
      if (response.ok) {
        setApplied(true);
      } else {
        setUploadError(data.message || 'Application failed');
      }
    } catch (error) {
      setUploadError('Server error');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading job details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-primary hover:underline flex items-center mb-6">
            <ChevronLeft size={20} /> Back to Jobs
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6 border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl font-bold text-primary">
                        {job.company[0]}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
                        <div className="flex items-center text-slate-500 mt-1">
                            <Building2 size={16} className="mr-1" />
                            {job.company}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="bg-blue-100 text-blue-700 font-semibold px-4 py-1 rounded-full text-sm">
                        {job.type}
                    </span>
                    <span className="text-slate-500 text-sm mt-2">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                <div className="flex items-center text-slate-600">
                    <MapPin className="text-primary mr-2" />
                    {job.location}
                </div>
                <div className="flex items-center text-slate-600">
                    <DollarSign className="text-primary mr-2" />
                    {job.salary}
                </div>
                 <div className="flex flex-wrap gap-2">
                    {job.tags && job.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">{tag}</span>
                    ))}
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {/* Description */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-8 border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Job Description</h2>
                <div className="prose text-slate-600">
                    <p>{job.description}</p>
                    <p className="mt-4">
                        (This is a sample description. In a real app, this would be richer HTML content.)
                    </p>
                </div>
            </div>

            {/* Apply Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 h-fit">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Apply for this Job</h3>
                
                {!user ? (
                    <div className="text-center py-4">
                        <p className="text-slate-600 mb-4">Please sign in to apply.</p>
                        <Link to="/login" className="btn btn-primary w-full block text-center">Sign In</Link>
                    </div>
                ) : applied ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
                        <h4 className="text-green-800 font-bold">Application Sent!</h4>
                        <p className="text-green-600 text-sm">Good luck!</p>
                    </div>
                ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF/DOC)</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                                <input 
                                    type="file" 
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <Upload className="mx-auto text-slate-400 mb-2" />
                                <span className="text-sm text-slate-500">
                                    {resume ? resume.name : "Click to upload"}
                                </span>
                            </div>
                            {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={applying}
                            className={`btn btn-primary w-full ${applying ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {applying ? 'Sending...' : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
