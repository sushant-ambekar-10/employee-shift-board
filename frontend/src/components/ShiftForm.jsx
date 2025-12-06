import React, { useState } from 'react';
import API from '../utils/api';

export default function ShiftForm({ employees, onShiftCreated }) {
  const [form, setForm] = useState({
    employeeId: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/shifts', form);
      setForm({ employeeId: '', date: '', startTime: '', endTime: '' });
      setError('');
      onShiftCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating shift');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shift-form">
      {error && <div className="error">{error}</div>}

      <select
        value={form.employeeId}
        onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
        required
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp._id} value={emp._id}>
            {emp.name} ({emp.employeeCode})
          </option>
        ))}
      </select>

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />

      <input
        type="time"
        value={form.startTime}
        onChange={(e) => setForm({ ...form, startTime: e.target.value })}
        placeholder="Start Time"
        required
      />

      <input
        type="time"
        value={form.endTime}
        onChange={(e) => setForm({ ...form, endTime: e.target.value })}
        placeholder="End Time"
        required
      />

      <button type="submit">Create Shift</button>
    </form>
  );
}
