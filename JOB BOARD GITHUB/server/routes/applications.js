const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const nodemailer = require('nodemailer');
const Job = require('../models/Job');

// Setup Nodemailer Transporter (Using Ethereal for testing, replace with real SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal.user@example.com', // Replace with real env vars
        pass: 'ethereal_pass'
    }
});

// @route   POST api/applications
// @desc    Apply for a job (with Resume upload)
// @access  Public (Should be private)
router.post('/', upload.single('resume'), async (req, res) => {
  const { jobId, userId } = req.body;
  const resumePath = req.file ? req.file.path : null;

  try {
    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, user: userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const application = await Application.create({
      job: jobId,
      user: userId,
      resume: resumePath,
      status: 'pending'
    });

    // Increment applications count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applications: 1 } });

    // Send Notification Email (Mock)
    console.log(`[EMAIL] Sending application confirmation to user ${userId} for job ${jobId}`);
    // await transporter.sendMail(...) // Uncomment with real creds

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/applications/my/:userId
// @desc    Get applications for a specific user
router.get('/my/:userId', async (req, res) => {
  try {
    const applications = await Application.find({ user: req.params.userId })
      .populate('job', 'title company location');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/applications/employer/all
// @desc    Get all applications for employer's jobs
// @access  Private
router.get('/employer/all', protect, async (req, res) => {
  try {
    // Get all jobs by this employer
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map(job => job._id);

    // Get all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Format response
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      candidateName: app.user?.name || 'Unknown',
      candidateEmail: app.user?.email || '',
      jobTitle: app.job?.title || '',
      resume: app.resume,
      status: app.status,
      createdAt: app.createdAt
    }));

    res.json(formattedApplications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/applications/job/:jobId
// @desc    Get applications for a specific job
// @access  Private
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH api/applications/:id
// @desc    Update application status
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'shortlisted', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify employer owns the job
    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
