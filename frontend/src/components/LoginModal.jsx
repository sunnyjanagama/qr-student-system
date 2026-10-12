import React, { useState } from 'react';
import { X, Lock, User, Mail, Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('ROLE_FACULTY');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await api.auth.register({
          username,
          email,
          password,
          fullName,
          role,
        });
        // Login immediately with new user
        await login(username, password);
      } else {
        await login(username, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCreds = (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '440px' }}
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
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                {isRegister ? 'Staff Registration' : 'Institutional Sign In'}
              </h3>
              <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-dim)' }}>
                {isRegister ? 'Create an authorized faculty account' : 'Access student records & verification tools'}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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

            {/* Quick Demo Switcher */}
            {!isRegister && (
              <div style={{
                background: 'var(--bg-card)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px dashed var(--border-subtle)',
                marginBottom: '1.25rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>
                  QUICK 1-CLICK DEMO LOGIN:
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setDemoCreds('admin', 'admin123')}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      background: username === 'admin' ? 'var(--primary-light)' : 'var(--bg-elevated)',
                      border: username === 'admin' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: username === 'admin' ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    👑 Admin (Full Access)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDemoCreds('faculty', 'faculty123')}
                    style={{
                      flex: 1,
                      padding: '0.45rem',
                      background: username === 'faculty' ? 'var(--primary-light)' : 'var(--bg-elevated)',
                      border: username === 'faculty' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      color: username === 'faculty' ? 'var(--primary)' : 'var(--text-main)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🎓 Faculty (Scanner)
                  </button>
                </div>
              </div>
            )}

            {isRegister && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. Robert Chen"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Institutional Email</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="robert.chen@college.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="ROLE_FACULTY">Faculty / Staff</option>
                    <option value="ROLE_ADMIN">System Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Already registered? Sign In' : 'Need an account? Register'}
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              {loading ? 'Authenticating...' : (isRegister ? 'Register' : 'Sign In')}
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
