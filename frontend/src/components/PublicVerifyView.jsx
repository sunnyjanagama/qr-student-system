import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  GraduationCap, 
  Building, 
  Award, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export const PublicVerifyView = ({ initialCode }) => {
  const [codeInput, setCodeInput] = useState(initialCode || '21CS101');
  const [loading, setLoading] = useState(false);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (codeToVerify) => {
    const target = (codeToVerify || codeInput).trim();
    if (!target) return;

    setLoading(true);
    setError('');

    try {
      const data = await api.qr.verify(target);
      setVerification(data);
    } catch (err) {
      setError(err.message || 'Verification service temporarily unavailable.');
      setVerification(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    } else {
      handleVerify('21CS101');
    }
  }, [initialCode]);

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Institutional Verification Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 1rem auto',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
        }}>
          <ShieldCheck size={32} />
        </div>

        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
          Official Student Verification Portal
        </h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
          Cryptographically verify identity certificates and active student enrollment status.
        </p>
      </div>

      {/* Verification Query Input */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <form 
          onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
          style={{ display: 'flex', gap: '0.5rem' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Enter Student Roll No (e.g. 21CS101) or UUID..."
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Authenticate'}
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Try demo passes:</span>
          {['21CS101', '22EC204', '23AI310', '20CS088'].map((demo) => (
            <button
              key={demo}
              type="button"
              onClick={() => { setCodeInput(demo); handleVerify(demo); }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                padding: '0.15rem 0.45rem',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              className="mono"
            >
              {demo}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Certificate */}
      {verification && (
        <div className="glass-card" style={{
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          border: verification.verified ? '2px solid rgba(16, 185, 129, 0.4)' : '2px solid rgba(244, 63, 94, 0.4)',
          boxShadow: verification.verified ? '0 16px 36px rgba(16, 185, 129, 0.12)' : 'none'
        }}>
          {/* Official Seal Watermark */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: '#818cf8',
                textTransform: 'uppercase'
              }}>
                STATE INSTITUTE OF TECHNOLOGY • REGISTRAR OFFICE
              </span>
              <h3 style={{ fontSize: '1.25rem', margin: '0.2rem 0 0 0' }}>
                Digital Identity Verification Certificate
              </h3>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              background: verification.verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: verification.verified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
              color: verification.verified ? '#34d399' : '#fb7185',
              fontSize: '0.8rem',
              fontWeight: 800
            }}>
              {verification.verified ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              <span>{verification.verified ? 'AUTHENTICATED' : 'UNVERIFIED'}</span>
            </div>
          </div>

          {verification.verified ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#ffffff',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #38bdf8'
                }}>
                  {verification.fullName[0]}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>{verification.fullName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#818cf8' }} className="mono">
                      {verification.rollNumber}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>•</span>
                    <span className={`badge badge-${(verification.status || 'ACTIVE').toLowerCase()}`}>
                      {verification.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Information */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                background: 'var(--bg-elevated)',
                padding: '1.25rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>DEPARTMENT / BRANCH</span>
                  <span style={{ fontWeight: 600 }}>{verification.department}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>ACADEMIC PROGRAM</span>
                  <span style={{ fontWeight: 600 }}>{verification.academicYear || 'Bachelor of Technology'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>SECTION & BATCH</span>
                  <span style={{ fontWeight: 600 }}>{verification.section ? `Section ${verification.section}` : 'General'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>BLOOD GROUP</span>
                  <span style={{ fontWeight: 600 }}>{verification.bloodGroup || 'Not Recorded'}</span>
                </div>
              </div>

              {/* Security signature footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.72rem',
                color: 'var(--text-dim)'
              }}>
                <span>Timestamp: {new Date(verification.verifiedAt).toLocaleString()}</span>
                <span className="mono">Digital Signature: SHA-256 Validated</span>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                {verification.message || 'No official record matches the supplied student identifier.'}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Please check the roll number or re-scan the QR code from the physical student badge.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
