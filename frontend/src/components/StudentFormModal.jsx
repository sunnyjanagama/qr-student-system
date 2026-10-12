import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const StudentFormModal = ({ isOpen, onClose, studentToEdit, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    section: 'A',
    academicYear: '1st Year (2024-2028)',
    dateOfBirth: '2005-01-15',
    bloodGroup: 'O+',
    guardianName: '',
    guardianPhone: '',
    address: '',
    cgpa: 8.5,
    attendancePercentage: 90.0,
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        rollNumber: studentToEdit.rollNumber || '',
        firstName: studentToEdit.firstName || '',
        lastName: studentToEdit.lastName || '',
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        department: studentToEdit.department || 'Computer Science & Engineering',
        section: studentToEdit.section || 'A',
        academicYear: studentToEdit.academicYear || '1st Year (2024-2028)',
        dateOfBirth: studentToEdit.dateOfBirth || '2005-01-15',
        bloodGroup: studentToEdit.bloodGroup || 'O+',
        guardianName: studentToEdit.guardianName || '',
        guardianPhone: studentToEdit.guardianPhone || '',
        address: studentToEdit.address || '',
        cgpa: studentToEdit.cgpa || 8.5,
        attendancePercentage: studentToEdit.attendancePercentage || 90.0,
        status: studentToEdit.status || 'ACTIVE',
      });
    } else {
      setFormData({
        rollNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Computer Science & Engineering',
        section: 'A',
        academicYear: '1st Year (2024-2028)',
        dateOfBirth: '2005-01-15',
        bloodGroup: 'O+',
        guardianName: '',
        guardianPhone: '',
        address: '',
        cgpa: 8.5,
        attendancePercentage: 90.0,
        status: 'ACTIVE',
      });
    }
    setError('');
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cgpa' || name === 'attendancePercentage' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (studentToEdit) {
        await api.students.update(studentToEdit.id, formData);
      } else {
        await api.students.create(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {studentToEdit ? <Save size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                {studentToEdit ? 'Edit Student Record' : 'Register New Student'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
                {studentToEdit ? 'Update details; QR code is preserved' : 'Automatically generates unique QR identity badge'}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {error && (
              <div style={{
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Basic Info */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Roll Number *</label>
                <input
                  type="text"
                  name="rollNumber"
                  className="form-input"
                  placeholder="e.g. 24CS101"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-input"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-input"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Student Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="Computer Science & Engineering">Computer Science & Engg</option>
                  <option value="Electronics & Communication">Electronics & Comm</option>
                  <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Section</label>
                <input
                  type="text"
                  name="section"
                  className="form-input"
                  placeholder="A, B, C..."
                  value={formData.section}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year / Batch</label>
                <input
                  type="text"
                  name="academicYear"
                  className="form-input"
                  placeholder="e.g. 2nd Year (2023-2027)"
                  value={formData.academicYear}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Personal / Medical */}
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Enrollment Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="GRADUATED">GRADUATED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            {/* Performance */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Cumulative GPA (0.0 - 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  className="form-input"
                  value={formData.cgpa}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Attendance Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  name="attendancePercentage"
                  className="form-input"
                  value={formData.attendancePercentage}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Guardian & Address */}
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Guardian Name</label>
                <input
                  type="text"
                  name="guardianName"
                  className="form-input"
                  placeholder="Parent or Guardian"
                  value={formData.guardianName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guardian Phone</label>
                <input
                  type="tel"
                  name="guardianPhone"
                  className="form-input"
                  placeholder="+91 Emergency Contact"
                  value={formData.guardianPhone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <textarea
                name="address"
                className="form-textarea"
                rows="2"
                placeholder="Street address, City, State"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (studentToEdit ? 'Save Changes' : 'Create & Generate QR')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
