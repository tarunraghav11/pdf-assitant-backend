const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const authMiddleware = require('../middleware/authMiddleware');

// Save user data
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { result, task } = req.body;
    const newData = new UserData({
      user: req.user.id,
      result,
      task
    });
    await newData.save();
    res.status(201).json({ msg: 'Data saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user-specific data
router.get('/data', authMiddleware, async (req, res) => {
  try {
    const data = await UserData.find({ user: req.user.id }).sort({ date: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
