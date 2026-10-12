import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Download, 
  QrCode, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Eye
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const StudentsView = ({ onSelectStudentCard, onOpenAddStudent, onEditStudent }) => {
  const { isAdmin } = useAuth();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.students.getAll({
        query,
        department,
        status,
        page,
        size: 10,
      });
      setStudents(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [query, department, status, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete student "${name}"?`)) {
      return;
    }
    try {
      await api.students.delete(id);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    }
  };

  const handleRegenerate = async (id) => {
    try {
      await api.students.regenerateQr(id);
      alert('QR code successfully regenerated and updated!');
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Failed to regenerate QR code');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            Student Directory
          </h1>
          <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-muted)' }}>
            Managing {totalElements} verified student records with cryptographic QR access passes.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => api.students.exportCsv()} 
            className="btn btn-secondary"
            title="Download CSV database export"
          >
            <Download size={16} />
            Export CSV
          </button>

          {isAdmin && (
            <button 
              onClick={onOpenAddStudent} 
              className="btn btn-primary"
            >
              <UserPlus size={16} />
              Register Student
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters Filter-bar */}
      <div className="glass-card" style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by Roll Number, Name, or Email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
          />
        </div>

        {/* Department Filter */}
        <div style={{ minWidth: '180px' }}>
          <select
            className="form-select"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All Departments</option>
            <option value="Computer Science & Engineering">Computer Science & Engg</option>
            <option value="Electronics & Communication">Electronics & Comm</option>
            <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Information Technology">Information Technology</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ minWidth: '150px' }}>
          <select
            className="form-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="GRADUATED">GRADUATED</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                <th style={{ padding: '0.9rem 1.25rem' }}>STUDENT</th>
                <th style={{ padding: '0.9rem 1rem' }}>ROLL NO</th>
                <th style={{ padding: '0.9rem 1rem' }}>DEPARTMENT</th>
                <th style={{ padding: '0.9rem 1rem' }}>YEAR & SECTION</th>
                <th style={{ padding: '0.9rem 1rem' }}>CGPA</th>
                <th style={{ padding: '0.9rem 1rem' }}>ATTENDANCE</th>
                <th style={{ padding: '0.9rem 1rem' }}>STATUS</th>
                <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading student database records...
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr 
                    key={student.id} 
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Student Info & Avatar */}
                    <td style={{ padding: '0.85rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}>
                          {student.firstName[0]}{student.lastName[0]}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                            {student.firstName} {student.lastName}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {student.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Roll Number */}
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }} className="mono">
                      {student.rollNumber}
                    </td>

                    {/* Department */}
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {student.department}
                    </td>

                    {/* Year & Section */}
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                      {student.academicYear || 'General'} {student.section ? `• Sec ${student.section}` : ''}
                    </td>

                    {/* CGPA */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontWeight: 700,
                        color: (student.cgpa >= 8.5) ? '#34d399' : (student.cgpa >= 7.0) ? '#818cf8' : '#f59e0b'
                      }}>
                        {student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                      </span>
                    </td>

                    {/* Attendance */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        fontWeight: 600,
                        color: (student.attendancePercentage >= 85) ? '#34d399' : (student.attendancePercentage >= 75) ? '#fbbf24' : '#fb7185'
                      }}>
                        {student.attendancePercentage ? `${student.attendancePercentage}%` : 'N/A'}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`badge badge-${(student.status || 'ACTIVE').toLowerCase()}`}>
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        {/* Open ID Card & QR */}
                        <button
                          onClick={() => onSelectStudentCard(student)}
                          className="btn btn-secondary btn-sm"
                          style={{ background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#818cf8' }}
                          title="View Digital ID Card & QR Badge"
                        >
                          <QrCode size={15} />
                          <span>ID Badge</span>
                        </button>

                        {/* Edit Student (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => onEditStudent(student)}
                            className="btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            title="Edit Student Information"
                          >
                            <Edit3 size={15} />
                          </button>
                        )}

                        {/* Regenerate QR (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleRegenerate(student.id)}
                            className="btn-icon"
                            style={{ width: '32px', height: '32px' }}
                            title="Regenerate QR Code"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}

                        {/* Delete Student (Admin only) */}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)}
                            className="btn-icon"
                            style={{ width: '32px', height: '32px', color: '#fb7185' }}
                            title="Delete Student Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    No students found matching your criteria. Try adjusting the search query or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-dim)' }}>
              Showing page {page + 1} of {totalPages} ({totalElements} total students)
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
