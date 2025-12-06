const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware');
const Employee = require('../models/Employee');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find().populate('userId', 'email role');
    res.json({ count: employees.length, employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
