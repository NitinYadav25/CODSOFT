import React, { useEffect, useState } from 'react';
import { Building2, MapPin, Globe } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      if (response.ok) {
        setCompanies(data);
      } else {
        setError('');
        setCompanies([]);
      }
    } catch (err) {
      // Silently fail - backend may not be running
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading companies...</div>;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Top Companies</h1>
          <p className="text-lg text-slate-600">Discover great places to work.</p>
        </div>

        {error && <div className="text-red-500 text-center mb-8">{error}</div>}

        {companies.length === 0 && !error ? (
           <div className="text-center text-slate-500 py-10">
             <p>No companies listed yet.</p>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companies.map((company) => (
              <div key={company._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-slate-100 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                    {company.logo ? (
                        <img src={company.logo} alt={company.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <Building2 size={32} />
                    )}
                </div>
                <h3 className="text-xl font-Bold text-slate-900 mb-2">{company.name}</h3>
                {company.industry && <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">{company.industry}</span>}
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{company.description}</p>
                
                <div className="w-full pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                    {company.location && (
                        <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            {company.location}
                        </div>
                    )}
                    {company.website && (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                            <Globe size={16} className="mr-1" />
                            Visit
                        </a>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
