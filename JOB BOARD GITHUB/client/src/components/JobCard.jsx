import React from 'react';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="card group hover:border-primary/50 cursor-pointer h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {job.company ? job.company[0] : 'C'}
          </div>
          <div>
            <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
            <p className="text-slate-500 text-sm">{job.company}</p>
          </div>
        </div>
        {job.type && (
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            {job.type}
            </span>
        )}
      </div>
      
      <div className="space-y-2 mb-4 flex-grow">
        {job.location && (
            <div className="flex items-center text-slate-500 text-sm">
            <MapPin size={16} className="mr-2" />
            {job.location}
            </div>
        )}
        {job.salary && (
            <div className="flex items-center text-slate-500 text-sm">
            <DollarSign size={16} className="mr-2" />
            {job.salary}
            </div>
        )}
        {job.posted && (
            <div className="flex items-center text-slate-500 text-sm">
            <Clock size={16} className="mr-2" />
            {job.posted}
            </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {job.tags && job.tags.map((tag, index) => (
          <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
      
      <Link to={`/jobs/${job._id}`} className="block w-full text-center mt-4 btn btn-outline group-hover:bg-primary group-hover:text-white group-hover:border-primary">
        Apply Now
      </Link>
    </div>
  );
};

export default JobCard;
