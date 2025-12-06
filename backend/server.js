require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const shiftRoutes = require('./routes/shifts');
const User = require('./models/User');
const Employee = require('./models/Employee');

const app = express();

app.use(express.json());
app.use(cors());

// Connect DB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('✅ DB Connected');
  seedData();
});

// Seed initial data
async function seedData() {
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  // Admin user
  const admin = await User.create({
    email: 'hire-me@anshumat.org',
    password: 'HireMe@2025!',
    role: 'admin'
  });

  await Employee.create({
    name: 'Admin User',
    employeeCode: 'EMP001',
    department: 'Operations',
    userId: admin._id
  });

  // Normal user
  const user = await User.create({
    email: 'user@test.com',
    password: 'Test123!',
    role: 'user'
  });

  await Employee.create({
    name: 'Test Employee',
    employeeCode: 'EMP002',
    department: 'Engineering',
    userId: user._id
  });

  console.log('✅ Seed data created');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/shifts', shiftRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server on port ${process.env.PORT}`);
});
