import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';

const Home = () => {
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
      // Build query string
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Find Your <span className="text-orange-400">Dream Job</span> Today
          </h1>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Connecting thousands of employers with the best talent. Search via keywords, location, or category.
          </p>
          
          <div className="bg-white p-2 rounded-lg shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-slate-200">
              <Search className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Job title or keyword" 
                className="w-full py-3 outline-none text-slate-700"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center px-4">
              <MapPin className="text-slate-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="City, state, or zip" 
                className="w-full py-3 outline-none text-slate-700"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
                onClick={handleSearch}
                className="btn btn-primary py-3 px-8 text-lg"
            >
                Search
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <main className="flex-grow bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Featured Jobs</h2>
            <Link to="/jobs" className="text-primary font-semibold hover:underline">View All Jobs &rarr;</Link>
          </div>
          
          {loading ? (
             <p className="text-center text-slate-500">Loading jobs...</p>
          ) : jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                <JobCard key={job._id} job={job} />
                ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">No jobs found matching your criteria.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
