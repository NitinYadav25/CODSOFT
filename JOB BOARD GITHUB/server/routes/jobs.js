const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET api/jobs
// @desc    Get all jobs (with optional search)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { keyword, location } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/jobs/employer/my-jobs
// @desc    Get all jobs posted by the logged-in employer
// @access  Private
router.get('/employer/my-jobs', protect, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/jobs/posted-by/:userId
// @desc    Get jobs posted by a specific user (Employer Dashboard)
// @access  Public (Should be protected)
router.get('/posted-by/:userId', async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/jobs
// @desc    Create a job
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, company, location, type, salary, description, responsibilities, requirements, tags, experience } = req.body;

  if (!title || !company || !location || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const job = new Job({
      title,
      company,
      location,
      type,
      salary,
      description,
      responsibilities,
      requirements,
      tags,
      experience,
      postedBy: req.user.id,
      status: 'active'
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PATCH api/jobs/:id
// @desc    Update a job
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'postedBy' && key !== '_id') {
        job[key] = req.body[key];
      }
    });

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
