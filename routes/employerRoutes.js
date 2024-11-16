const express = require('express');
const Employer = require('../models/Employer');
const upload = require('../config/upload');
const router = express.Router();
const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  };
  
  /*const upload = multer({ storage: storage, fileFilter: pdfFilter });*/

// Register Employer
router.post('/register', upload.fields([{ name: 'projectPosting' }, { name: 'internshipExperienceLetter' }]), async (req, res) => {
    const { companyName, contactPersons, jobProfile, jobExperience, address, workPreference } = req.body;
    const projectPosting = req.files['projectPosting'] ? req.files['projectPosting'][0].path : null;
    const internshipExperienceLetter = req.files['internshipExperienceLetter'] ? req.files['internshipExperienceLetter'][0].path : null;
  
    try {
      const newEmployer = new Employer({
        companyName,
        contactPersons,
        jobProfile,
        jobExperience,
        address,
        workPreference,
        projectPosting,
        internshipExperienceLetter
      });
      await newEmployer.save();
      res.status(201).json({ message: 'Employer registered' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Get Employer Profile
router.get('/:id', async (req, res) => {
    try {
        const employer = await Employer.findById(req.params.id);
        res.json(employer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Employer
router.put('/:id', async (req, res) => {
    try {
        const updatedEmployer = await Employer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEmployer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
