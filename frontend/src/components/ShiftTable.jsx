import React from 'react';
import API from '../utils/api';

export default function ShiftTable({ shifts, isAdmin, onUpdate }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this shift?')) return;
    try {
      await API.delete(`/shifts/${id}`);
      onUpdate();
    } catch (error) {
      alert('Error deleting shift');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/shifts/${id}/status`, { status });
      onUpdate();
    } catch (error) {
      alert('Error updating shift');
    }
  };

  return (
    <table className="shifts-table">
      <thead>
        <tr>
          <th>Employee</th>
          <th>Date</th>
          <th>Time</th>
          <th>Status</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {shifts.map((shift) => (
          <tr key={shift._id}>
            <td>{shift.employeeId?.name}</td>
            <td>{new Date(shift.date).toDateString()}</td>
            <td>{shift.startTime} - {shift.endTime}</td>
            <td>
              <select
                value={shift.status}
                onChange={(e) => handleStatusChange(shift._id, e.target.value)}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            {isAdmin && (
              <td>
                <button onClick={() => handleDelete(shift._id)} className="delete-btn">
                  Delete
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
