import React, { useState } from 'react';
import { X, Lock, User, Mail, Shield, AlertCircle, ArrowRight, Server, CheckCircle2, RefreshCw, Settings, ChevronDown, ChevronUp } from 'lucide-react';
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

  // Backend API connection configuration & diagnostics
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(() => api.getBaseUrl());
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  if (!isOpen) return null;

  const isLocalTarget = api.getBaseUrl().includes('localhost');
  const isHostedBrowser = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConnectionStatus(null);
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
        await login(username, password);
      } else {
        await login(username, password);
      }
      onClose();
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.toLowerCase().includes('network')) {
        setError('Failed to fetch');
        setShowApiConfig(true); // automatically reveal config so user can fix or see why
      } else {
        setError(msg || 'Authentication failed. Please check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async (customUrl) => {
    setTestingConnection(true);
    setConnectionStatus(null);
    const targetUrl = (customUrl || apiUrlInput || api.getBaseUrl()).trim().replace(/\/+$/, '');
    try {
      const res = await fetch(`${targetUrl}/api/health`, { method: 'GET' });
      if (res.ok) {
        setConnectionStatus({ type: 'success', message: 'Backend is connected and healthy! 🎉' });
      } else {
        setConnectionStatus({ type: 'error', message: `Server reached but responded with HTTP ${res.status}.` });
      }
    } catch (err) {
      setConnectionStatus({
        type: 'error',
        message: 'Could not reach server. If using Render free tier, wait 60s for cold start, or verify your URL.'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveApiUrl = () => {
    if (apiUrlInput && apiUrlInput.trim()) {
      api.setBaseUrl(apiUrlInput.trim());
      setConnectionStatus({ type: 'success', message: 'Target backend URL updated! Retrying connection test...' });
      handleTestConnection(apiUrlInput.trim());
    }
  };

  const handleResetApiUrl = () => {
    api.setBaseUrl('');
    setApiUrlInput(api.getBaseUrl());
    setConnectionStatus(null);
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
        style={{ maxWidth: '460px', maxHeight: '92vh', overflowY: 'auto' }}
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
                padding: '0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <AlertCircle size={16} />
                  <span>
                    {error === 'Failed to fetch' ? 'Connection Failed: Unable to Reach Backend' : error}
                  </span>
                </div>

                {error === 'Failed to fetch' && (
                  <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', lineHeight: '1.45', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: '0 0 0.35rem 0' }}>
                      Target server: <strong style={{ color: 'var(--text-main)', wordBreak: 'break-all' }}>{api.getBaseUrl()}</strong>
                    </p>
                    {isHostedBrowser && isLocalTarget ? (
                      <p style={{ margin: 0, color: '#fca5a5' }}>
                        ⚠️ You are on a deployed site, but it is trying to connect to <code>localhost:8080</code>. Please paste your deployed Render backend URL in the box below!
                      </p>
                    ) : (
                      <p style={{ margin: 0, color: '#cbd5e1' }}>
                        ⏳ <strong>Render Free Tier Note:</strong> Inactive instances sleep after 15m. It takes ~60 seconds to wake up. Wait a minute and click "Retry Sign In".
                      </p>
                    )}
                  </div>
                )}
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

            {/* Backend URL Settings / Diagnostics Widget */}
            <div style={{
              marginTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '0.75rem'
            }}>
              <button
                type="button"
                onClick={() => setShowApiConfig(!showApiConfig)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  cursor: 'pointer',
                  padding: '0.2rem 0'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Server size={13} />
                  Backend API: <code style={{ color: 'var(--primary)', fontSize: '0.74rem' }}>{api.getBaseUrl()}</code>
                </span>
                {showApiConfig ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showApiConfig && (
                <div style={{
                  background: 'var(--bg-card)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  marginTop: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                    Set Custom Backend API URL:
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
                    <input
                      type="url"
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                      placeholder="https://your-service.onrender.com"
                      value={apiUrlInput}
                      onChange={(e) => setApiUrlInput(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                      onClick={handleSaveApiUrl}
                    >
                      Save
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleTestConnection(apiUrlInput)}
                      disabled={testingConnection}
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <RefreshCw size={11} className={testingConnection ? 'spin' : ''} />
                      {testingConnection ? 'Testing...' : 'Test Backend Connection'}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetApiUrl}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Reset to Default
                    </button>
                  </div>

                  {connectionStatus && (
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      background: connectionStatus.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: connectionStatus.type === 'success' ? '#4ade80' : '#f87171',
                      border: connectionStatus.type === 'success' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}>
                      {connectionStatus.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                      <span>{connectionStatus.message}</span>
                    </div>
                  )}
                </div>
              )}
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
                setConnectionStatus(null);
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
