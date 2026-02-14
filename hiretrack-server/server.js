// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Prajwal327:Prajwal327@cluster0.5ffgdxw.mongodb.net/?appName=Cluster0')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// Job Schema
const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  dateApplied: { type: Date, default: Date.now },
  status: { type: String, default: 'Applied' },
  salary: { type: Number, default: 0 }, // Check this line
  notes: { type: String, default: '' }   // Check this line
});

const Job = mongoose.model('Job', jobSchema);

// ROUTES
// 1. Get all jobs
app.get('/api/jobs', async (req, res) => {
  const jobs = await Job.find().sort({ dateApplied: -1 });
  res.json(jobs);
});

// 2. Add a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const { company, role, salary, notes } = req.body;
    const newJob = new Job({ 
      company, 
      role, 
      salary: Number(salary) || 0, // Force number conversion
      notes 
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// 3. Update Status
app.patch('/api/jobs/:id', async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status }, 
    { new: true }
  );
  res.json(updatedJob);
});

// 4. Delete Job
app.delete('/api/jobs/:id', async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;