require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Job = require('./models/Job'); // Import the Job model

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Body parser for JSON data

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes

// GET all jobs or filter by query parameters with pagination
app.get('/api/jobs', async (req, res) => {
    try {
        const { location, experience, salary, func, industry, jobType, search, page = 1, limit = 10 } = req.query;
        let filter = {};

        if (location) {
            filter.location = new RegExp(location, 'i'); // Case-insensitive search
        }
        if (experience) {
            filter.experience = new RegExp(experience, 'i');
        }
        if (salary) {
            filter.salary = new RegExp(salary, 'i');
        }
        if (func) {
            filter.function = new RegExp(func, 'i');
        }
        if (industry) {
            filter.industry = new RegExp(industry, 'i');
        }
        if (jobType) {
            filter.jobType = new RegExp(jobType, 'i');
        }
        if (search) {
            // Search across multiple fields
            filter.$or = [
                { jobTitle: new RegExp(search, 'i') },
                { companyName: new RegExp(search, 'i') },
                { 'jobDescription.keyResponsibilities': new RegExp(search, 'i') },
                { 'jobDescription.requiredQualifications': new RegExp(search, 'i') },
                { 'jobDescription.preferredSkills': new RegExp(search, 'i') },
                { skillsRequired: new RegExp(search, 'i') }
            ];
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const jobs = await Job.find(filter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limitNum);

        const totalJobs = await Job.countDocuments(filter);

        res.json({
            jobs,
            totalJobs,
            currentPage: pageNum,
            totalPages: Math.ceil(totalJobs / limitNum)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET a single job by ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST a new job
app.post('/api/jobs', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a job by ID
app.put('/api/jobs/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body, {
                new: true, // Return the updated document
                runValidators: true // Run schema validators on update
            }
        );
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(updatedJob);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE a job by ID
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});