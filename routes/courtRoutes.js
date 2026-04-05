// routes/courtRoutes.js
const express = require('express');
const router = express.Router();
const Court = require('../models/Court');
const bcrypt = require('bcryptjs');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Get all courts
router.get('/', verifyToken, async (req, res) => {
  try {
    const courts = await Court.find().select('_id name location');
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new court
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const location = typeof req.body.location === 'string' ? req.body.location.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!name || !location || !password) {
      return res.status(400).json({ error: 'name, location and password are required' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const court = new Court({ name, location, passwordHash });
    await court.save();
    res.status(201).json({ _id: court._id, name: court.name, location: court.location });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'Court name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Delete court
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.json({ msg: "Court deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
