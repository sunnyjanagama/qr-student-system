import React from 'react';
import { 
  QrCode, 
  LayoutDashboard, 
  Users, 
  Scan, 
  ShieldCheck, 
  LogOut, 
  Sun, 
  Moon, 
  UserCheck, 
  LogIn 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentTab, setCurrentTab, theme, setTheme, onOpenLogin }) => {
  const { user, isAuthenticated, logout, isAdmin, quickLogin } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg-card)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand Logo */}
      <div 
        onClick={() => setCurrentTab('dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
        }}>
          <QrCode size={22} strokeWidth={2.2} />
        </div>
        <div>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.25rem', 
            fontWeight: 800,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            Edu<span className="gradient-text">QR</span>
          </span>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1 }}>
            Student Information & QR ID System
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        background: 'var(--bg-elevated)',
        padding: '0.25rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setCurrentTab('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: currentTab === 'dashboard' ? 'var(--primary)' : 'transparent',
            color: currentTab === 'dashboard' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>

        <button
          onClick={() => setCurrentTab('students')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: currentTab === 'students' ? 'var(--primary)' : 'transparent',
            color: currentTab === 'students' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <Users size={16} />
          Students
        </button>

        <button
          onClick={() => setCurrentTab('scanner')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: currentTab === 'scanner' ? 'var(--primary)' : 'transparent',
            color: currentTab === 'scanner' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <Scan size={16} />
          QR Scanner
        </button>

        <button
          onClick={() => setCurrentTab('verify')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 0.85rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: currentTab === 'verify' ? 'var(--primary)' : 'transparent',
            color: currentTab === 'verify' ? '#ffffff' : 'var(--text-muted)'
          }}
        >
          <ShieldCheck size={16} />
          Public Verify
        </button>
      </nav>

      {/* Right Controls: Theme Toggle & User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="btn-icon"
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* User pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--bg-elevated)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: isAdmin ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #10b981, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.1 }}>
                  {user.fullName || user.username}
                </span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: isAdmin ? '#fbbf24' : '#34d399', 
                  fontWeight: 700 
                }}>
                  {isAdmin ? 'ADMINISTRATOR' : 'FACULTY'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Sign Out"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <LogOut size={15} />
              <span style={{ display: 'inline' }}>Logout</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => quickLogin('ADMIN')}
              className="btn btn-secondary btn-sm"
              title="Quick sign in as Administrator"
            >
              <UserCheck size={14} />
              Demo Admin
            </button>
            <button
              onClick={onOpenLogin}
              className="btn btn-primary btn-sm"
            >
              <LogIn size={15} />
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
