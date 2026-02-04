const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// @route   GET api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/companies
// @desc    Add a new company
router.post('/', async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
