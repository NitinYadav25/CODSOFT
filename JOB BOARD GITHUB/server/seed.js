const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

// Sample Companies Data
const companies = [
  {
    name: "TechFlow Systems",
    description: "Leading provider of AI-driven workflow automation solutions. We help businesses streamline operations with cutting-edge technology.",
    industry: "Information Technology",
    location: "San Francisco, CA",
    website: "https://techflow.example.com",
    logo: "https://ui-avatars.com/api/?name=TechFlow&background=0D8ABC&color=fff&size=128"
  },
  {
    name: "CreativeMinds Studio",
    description: "A global design agency specializing in branding, UI/UX, and digital experiences for Fortune 500 clients.",
    industry: "Design & Creative",
    location: "New York, NY",
    website: "https://creativeminds.example.com",
    logo: "https://ui-avatars.com/api/?name=Creative&background=FF5722&color=fff&size=128"
  },
  {
    name: "GreenEarth Energy",
    description: "Sustainable energy solutions for a better tomorrow. We focus on solar, wind, and hydro power innovations.",
    industry: "Energy & Environment",
    location: "Austin, TX",
    website: "https://greenearth.example.com",
    logo: "https://ui-avatars.com/api/?name=GreenEarth&background=4CAF50&color=fff&size=128"
  },
  {
    name: "FinSecure Bank",
    description: "Next-generation fintech banking platform providing secure and seamless financial services to millions.",
    industry: "Finance",
    location: "London, UK",
    website: "https://finsecure.example.com",
    logo: "https://ui-avatars.com/api/?name=FinSecure&background=673AB7&color=fff&size=128"
  },
  {
    name: "HealthPlus Care",
    description: "Innovative healthcare provider utilizing telemedicine and AI diagnostics to improve patient outcomes.",
    industry: "Healthcare",
    location: "Toronto, Canada",
    website: "https://healthplus.example.com",
    logo: "https://ui-avatars.com/api/?name=HealthPlus&background=E91E63&color=fff&size=128"
  },
  {
    name: "Quantum Dynamics",
    description: "Pioneering research in quantum computing and advanced materials science.",
    industry: "Research & Science",
    location: "Boston, MA",
    website: "https://quantum.example.com",
    logo: "https://ui-avatars.com/api/?name=Quantum&background=607D8B&color=fff&size=128"
  }
];

// Sample Jobs Data
const jobs = [
  // --- Tech / Software ---
  {
    title: "Senior Frontend Developer",
    company: "TechFlow Systems",
    location: "Remote",
    type: "Full Time",
    salary: "$120k - $150k",
    description: "We are looking for an experienced Frontend Developer to lead our web team. Proficient in React, TypeScript, and Tailwind CSS required.",
    tags: ["React", "TypeScript", "Frontend"]
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "FinSecure Bank",
    location: "Bangalore, India",
    type: "Full Time",
    salary: "₹18L - ₹25L",
    description: "Join our fintech security team in Bangalore. Experience with Node.js, Express, and MongoDB is a must.",
    tags: ["Node.js", "Backend", "Security"]
  },
  {
    title: "Full Stack Developer",
    company: "CreativeMinds Studio",
    location: "Mumbai, India",
    type: "Full Time",
    salary: "₹15L - ₹22L",
    description: "We need a versatile developer for our Mumbai office. MERN stack expertise is preferred.",
    tags: ["MERN", "Full Stack", "JavaScript"]
  },
  {
    title: "DevOps Engineer",
    company: "GreenEarth Energy",
    location: "Delhi, India",
    type: "Full Time",
    salary: "₹20L - ₹30L",
    description: "Manage our cloud infrastructure on AWS. Kubernetes and Docker experience needed.",
    tags: ["AWS", "DevOps", "Docker"]
  },
  {
    title: "Python Developer",
    company: "Quantum Dynamics",
    location: "Pune, India",
    type: "Contract",
    salary: "₹12L - ₹18L",
    description: "Work on AI/ML pipelines. Python and TensorFlow experience required.",
    tags: ["Python", "AI", "Machine Learning"]
  },
  
  // --- Design ---
  {
    title: "UI/UX Designer",
    company: "CreativeMinds Studio",
    location: "Remote",
    type: "Part Time",
    salary: "$40 - $60 / hr",
    description: "Design beautiful and functional interfaces for our global clients. Figma mastery expected.",
    tags: ["UI/UX", "Design", "Figma"]
  },
  
  // --- Marketing & Sales ---
  {
    title: "Marketing Manager",
    company: "HealthPlus Care",
    location: "Hyderabad, India",
    type: "Full Time",
    salary: "₹10L - ₹15L",
    description: "Lead our digital marketing campaigns and improve patient outreach in Hyderabad region.",
    tags: ["Marketing", "SEO", "Content"]
  },
  {
    title: "Sales Executive",
    company: "TechFlow Systems",
    location: "Mumbai, India",
    type: "Full Time",
    salary: "₹5L - ₹8L + Commission",
    description: "Drive sales for our new SaaS product. B2B sales experience preferred.",
    tags: ["Sales", "B2B", "SaaS"]
  },

  // --- Support & HR ---
  {
    title: "Customer Support Specialist",
    company: "FinSecure Bank",
    location: "Chennai, India",
    type: "Full Time",
    salary: "₹4L - ₹6L",
    description: "Provide world-class support to our banking customers. 24/7 shifts available.",
    tags: ["Support", "Customer Service"]
  },
  {
    title: "HR Generalist",
    company: "GreenEarth Energy",
    location: "Bangalore, India",
    type: "Full Time",
    salary: "₹8L - ₹12L",
    description: "Manage recruitment and employee relations for our growing team.",
    tags: ["HR", "Recruitment", "Management"]
  },

  // --- More Tech ---
  {
    title: "Android Developer",
    company: "HealthPlus Care",
    location: "Remote",
    type: "Contract",
    salary: "$50 / hr",
    description: "Build our patient-facing mobile application using Kotlin.",
    tags: ["Android", "Kotlin", "Mobile"]
  },
  {
    title: "Data Analyst",
    company: "Quantum Dynamics",
    location: "Gurgaon, India",
    type: "Full Time",
    salary: "₹14L - ₹20L",
    description: "Analyze business metrics and generate actionable insights.",
    tags: ["Data", "SQL", "Analytics"]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/jobboard', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await Company.deleteMany({});
    await Job.deleteMany({});
    console.log('Cleared existing data');

    // Insert Companies
    await Company.insertMany(companies);
    console.log('Added companies');

    // Create a dummy employer User to associate jobs with
    const User = require('./models/User'); // Import User model safely
    let employer = await User.findOne({ email: 'employer@example.com' });
    if (!employer) {
        const bcrypt = require('bcryptjs'); // Need bcrypt here locally usually, or just store plain text if schema allows (schema hashes on save!)
        // Wait, schema hashes on save. So we can just create using User.create
        employer = await User.create({
            name: "Demo Employer",
            email: "employer@example.com",
            password: "password123",
            role: "employer"
        });
    }

    // Add postedBy to jobs and Insert
    const jobsWithUser = jobs.map(job => ({ ...job, postedBy: employer._id }));
    await Job.insertMany(jobsWithUser);
    console.log('Added sample jobs');

    mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedDB();
