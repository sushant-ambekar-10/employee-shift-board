import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import ShiftForm from '../components/ShiftForm';
import ShiftTable from '../components/ShiftTable';
import '../App.css';

export default function Dashboard() {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [shiftsRes, empRes] = await Promise.all([
        API.get('/shifts'),
        API.get('/employees')
      ]);
      setShifts(shiftsRes.data.shifts);
      setEmployees(empRes.data.employees);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>📊 Shift Board</h2>
        <div>
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <h1>Welcome, {user?.email}</h1>

        {user?.role === 'admin' && (
          <div className="admin-section">
            <h2>Admin: Create Shift</h2>
            <ShiftForm employees={employees} onShiftCreated={fetchData} />
          </div>
        )}

        <div className="shifts-section">
          <h2>Shifts ({shifts.length})</h2>
          <ShiftTable shifts={shifts} isAdmin={user?.role === 'admin'} onUpdate={fetchData} />
        </div>
      </div>
    </div>
  );
}
