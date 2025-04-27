const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: true,
    index: true
  },
  student_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  parent_name: {
    type: String,
    required: true
  },
  contact_number: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
