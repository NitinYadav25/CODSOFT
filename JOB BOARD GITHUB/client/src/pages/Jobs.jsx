import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import JobCard from '../components/JobCard';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (searchQuery = '') => {
    setLoading(true);
    try {
        let url = '/api/jobs';
        if (searchQuery) url += searchQuery;
        
        const response = await fetch(url);
        const data = await response.json();
        setJobs(data);
    } catch (error) {
        // Silently fail - backend may not be running
        setJobs([]);
    } finally {
        setLoading(false);
    }
  };

  const handleSearch = () => {
    let queryParts = [];
    if (keyword) queryParts.push(`keyword=${encodeURIComponent(keyword)}`);
    if (location) queryParts.push(`location=${encodeURIComponent(location)}`);
    const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    fetchJobs(queryString);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-5 flex items-center border rounded-lg px-4 py-2 bg-slate-50">
                    <Search className="text-slate-400 mr-2" size={20} />
                    <input 
                        type="text" 
                        placeholder="Job title, keywords, or company" 
                        className="w-full bg-transparent outline-none text-slate-700"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="md:col-span-5 flex items-center border rounded-lg px-4 py-2 bg-slate-50">
                    <MapPin className="text-slate-400 mr-2" size={20} />
                    <input 
                        type="text" 
                        placeholder="City, state, or zip" 
                        className="w-full bg-transparent outline-none text-slate-700"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </div>
                <div className="md:col-span-2">
                    <button 
                        onClick={handleSearch}
                        className="btn btn-primary w-full h-full flex items-center justify-center gap-2"
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">All Jobs</h1>
            <span className="text-slate-500">{jobs.length} jobs found</span>
        </div>

        {loading ? (
             <p className="text-center text-slate-500 py-10">Loading jobs...</p>
        ) : jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                <JobCard key={job._id} job={job} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                <Filter className="mx-auto text-slate-300 mb-3" size={48} />
                <p className="text-slate-500 text-lg">No jobs found matching your criteria.</p>
                <button 
                    onClick={() => { setKeyword(''); setLocation(''); fetchJobs(); }}
                    className="text-primary hover:underline mt-2"
                >
                    Clear filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
