import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Users, TrendingUp, Clock, Shield, BarChart3, CheckCircle, ArrowRight, Star } from 'lucide-react';

const EmployerLanding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.role === 'employer') {
      navigate('/employer/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-24 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find & Hire Top Talent
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Post jobs, review applications, and build your dream team with JobHive's powerful hiring platform.
          </p>
          <Link to="/employer-signup" className="btn btn-primary inline-block px-8 py-4 text-lg">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            Why Choose JobHive?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="bg-blue-100 p-4 rounded-lg mb-4 inline-block">
                <Briefcase size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Job Posting</h3>
              <p className="text-slate-600 mb-4">
                Post jobs in minutes with our intuitive job posting form. Highlight your company culture and attract the right candidates.
              </p>
              <div className="flex items-center text-primary font-semibold">
                Learn more <ArrowRight size={16} className="ml-2" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="bg-green-100 p-4 rounded-lg mb-4 inline-block">
                <Users size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Application Management</h3>
              <p className="text-slate-600 mb-4">
                Organize applications, shortlist candidates, and communicate directly. All in one centralized dashboard.
              </p>
              <div className="flex items-center text-primary font-semibold">
                Learn more <ArrowRight size={16} className="ml-2" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="bg-purple-100 p-4 rounded-lg mb-4 inline-block">
                <TrendingUp size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Analytics & Insights</h3>
              <p className="text-slate-600 mb-4">
                Track job performance, application trends, and hiring metrics to optimize your recruitment strategy.
              </p>
              <div className="flex items-center text-primary font-semibold">
                Learn more <ArrowRight size={16} className="ml-2" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="bg-orange-100 p-4 rounded-lg mb-4 inline-block">
                <Clock size={32} className="text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Save Time</h3>
              <p className="text-slate-600 mb-4">
                Automate repetitive tasks and focus on what matters - building great teams. Spend less time on admin.
              </p>
              <div className="flex items-center text-primary font-semibold">
                Learn more <ArrowRight size={16} className="ml-2" />
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="bg-red-100 p-4 rounded-lg mb-4 inline-block">
                <Shield size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Reliable</h3>
              <p className="text-slate-600 mb-4">
                Your data is encrypted and secure. We follow industry best practices to protect your information.
              </p>
              <div className="flex items-center text-primary font-semibold">
                Learn more <ArrowRight size={16} className="ml-2" />
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg transition-all">
              <div className="bg-cyan-100 p-4 rounded-lg mb-4 inline-block">
                <BarChart3 size={32} className="text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Reports</h3>
              <p className="text-slate-600 mb-4">
                Generate comprehensive reports on your hiring process. Identify bottlenecks and improve efficiency.
              </p>
              <div className="flex items-center text-primary font-semibold">
                Learn more <ArrowRight size={16} className="ml-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up as an employer and set up your company profile.' },
              { step: 2, title: 'Post Jobs', desc: 'Create job listings with detailed descriptions and requirements.' },
              { step: 3, title: 'Review Apps', desc: 'Receive applications from qualified candidates instantly.' },
              { step: 4, title: 'Hire Talent', desc: 'Interview, shortlist, and hire your ideal candidate.' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">
            Simple, Transparent Pricing
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="p-8 rounded-xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Starter</h3>
              <p className="text-slate-600 mb-4">Perfect for small teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">Free</span>
                <p className="text-slate-600">Forever</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> 3 Job Posts</li>
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Basic Analytics</li>
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Email Support</li>
              </ul>
              <button className="w-full btn btn-outline py-2">Get Started</button>
            </div>

            {/* Professional */}
            <div className="p-8 rounded-xl border-2 border-primary bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-slate-900">Professional</h3>
                <Star size={24} className="text-yellow-500" />
              </div>
              <p className="text-slate-600 mb-4">For growing companies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">$99</span>
                <p className="text-slate-600">per month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Unlimited Job Posts</li>
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Advanced Analytics</li>
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Priority Support</li>
              </ul>
              <button className="w-full btn btn-primary py-2">Start Free Trial</button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-600 mb-4">For large enterprises</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">Custom</span>
                <p className="text-slate-600">Contact us</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Custom Integrations</li>
                <li className="flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Dedicated Account Manager</li>
              </ul>
              <button className="w-full btn btn-outline py-2">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Hire Your Next Team Member?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of companies using JobHive to find and hire top talent.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/employer-signup" className="btn bg-white text-primary hover:bg-slate-100 px-8 py-3">
              Create Employer Account
            </Link>
            <a href="#" className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10 px-8 py-3">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployerLanding;
