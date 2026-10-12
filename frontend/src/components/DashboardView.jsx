import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Award, 
  Activity, 
  Scan, 
  UserPlus, 
  Download, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DashboardView = ({ onNavigate, onOpenAddStudent }) => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await api.analytics.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Hero Welcome Banner */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#a5b4fc',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.65rem'
          }}>
            <Sparkles size={13} />
            <span>INSTITUTIONAL QR IDENTITY ENGINE</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem' }}>
            Welcome back, <span className="gradient-text">{user?.fullName || 'Faculty Administrator'}</span> 👋
          </h1>
          <p style={{ fontSize: '0.92rem', margin: 0, color: 'var(--text-muted)' }}>
            Real-time student information, instant QR digital authentication badges, and live verification logs.
          </p>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('scanner')} 
            className="btn btn-primary"
            style={{ boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}
          >
            <Scan size={17} />
            Launch Scanner
          </button>

          {isAdmin && (
            <button 
              onClick={onOpenAddStudent} 
              className="btn btn-secondary"
            >
              <UserPlus size={17} />
              Add Student
            </button>
          )}

          <button 
            onClick={() => api.students.exportCsv()} 
            className="btn btn-secondary"
            title="Export all student records to CSV"
          >
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {/* Card 1: Total Students */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)' }}>TOTAL ENROLLED</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : (stats?.totalStudents || 0)}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
              {stats?.activeStudents || 0} active
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0 0', color: 'var(--text-muted)' }}>
            Registered digital QR identities
          </p>
        </div>

        {/* Card 2: Average CGPA */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)' }}>AVERAGE CGPA</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : (stats?.averageCgpa?.toFixed(2) || '0.00')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 10.0</span>
          </div>
          <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0 0', color: 'var(--text-muted)' }}>
            Institution academic score index
          </p>
        </div>

        {/* Card 3: Average Attendance */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)' }}>AVG ATTENDANCE</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : `${stats?.averageAttendance || 0}%`}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>Healthy</span>
          </div>
          <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0 0', color: 'var(--text-muted)' }}>
            Monitored campus presence rate
          </p>
        </div>

        {/* Card 4: Recent Scans */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dim)' }}>RECENT SCANS</span>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Scan size={20} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {loading ? '...' : (stats?.recentScans?.length || 0)}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 600 }}>Verifications</span>
          </div>
          <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0 0', color: 'var(--text-muted)' }}>
            Logged in real-time database
          </p>
        </div>
      </div>

      {/* Main Grid: Department Breakdown & Recent Verification Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.6fr',
        gap: '1.5rem'
      }}>
        {/* Department Breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Department Distribution</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Active Branches</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
            {stats?.departmentDistribution && Object.keys(stats.departmentDistribution).length > 0 ? (
              Object.entries(stats.departmentDistribution).map(([dept, count]) => {
                const total = stats.totalStudents || 1;
                const percentage = Math.round((count / total) * 100);
                return (
                  <div key={dept}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dept}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} students ({percentage}%)</span>
                    </div>
                    <div style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                        borderRadius: '999px'
                      }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-dim)', margin: '2rem 0' }}>No department data available</p>
            )}
          </div>
        </div>

        {/* Live Scan Activity Feed */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent QR Verification Activity</h3>
            </div>
            <button 
              onClick={() => onNavigate('students')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                cursor: 'pointer'
              }}
            >
              All Students <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>ROLL NUMBER</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>STUDENT NAME</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>PURPOSE</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>SCANNED BY</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentScans && stats.recentScans.length > 0 ? (
                  stats.recentScans.slice(0, 7).map((scan) => (
                    <tr key={scan.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }} className="mono">
                        {scan.studentRollNumber || 'N/A'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-main)' }}>
                        {scan.studentName || 'Unknown'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                        {scan.scanPurpose}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-dim)' }}>
                        @{scan.scannedByUsername || 'public'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        <span className={`badge ${scan.verificationStatus === 'VALID' ? 'badge-valid' : 'badge-invalid'}`}>
                          {scan.verificationStatus === 'VALID' ? 'Verified' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                      No scan records logged yet. Use the QR scanner to verify student identity!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
