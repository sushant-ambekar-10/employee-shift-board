const express = require('express');
const { authMiddleware, adminOnly } = require('../middleware');
const Shift = require('../models/Shift');
const Employee = require('../models/Employee');

const router = express.Router();

// Helper: Convert time "09:00" to minutes
const timeToMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// Helper: Calculate duration in hours
const getDuration = (start, end) => {
  return (timeToMinutes(end) - timeToMinutes(start)) / 60;
};

// Create Shift (Admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { employeeId, date, startTime, endTime } = req.body;

    // Rule 1: Check minimum 4 hours
    const duration = getDuration(startTime, endTime);
    if (duration < 4) {
      return res.status(400).json({ message: `Shift must be at least 4 hours. Current: ${duration}h` });
    }

    // Rule 2: Check no overlapping shifts
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const existing = await Shift.findOne({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      return res.status(400).json({ 
        message: `Shift overlaps with existing shift: ${existing.startTime} - ${existing.endTime}` 
      });
    }

    // Create shift
    const shift = new Shift({
      employeeId,
      date: new Date(date),
      startTime,
      endTime,
      createdBy: req.user.id
    });

    await shift.save();
    await shift.populate('employeeId', 'name employeeCode department');

    res.status(201).json({ message: 'Shift created', shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Shifts
router.get('/', authMiddleware, async (req, res) => {
  try {
    let query = {};

    // If user is not admin, only show their shifts
    if (req.user.role !== 'admin') {
      const employee = await Employee.findOne({ userId: req.user.id });
      if (!employee) return res.status(404).json({ message: 'Employee not found' });
      query.employeeId = employee._id;
    }

    const shifts = await Shift.find(query)
      .populate('employeeId', 'name employeeCode department')
      .sort({ date: -1 });

    res.json({ count: shifts.length, shifts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Status
router.put('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('employeeId');

    res.json({ message: `Shift ${status}`, shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Shift
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Shift deleted', shift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
