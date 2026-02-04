const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  industry: {
    type: String
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  logo: {
    type: String // URL to logo image
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);
