import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  GraduationCap, 
  Phone, 
  Droplet, 
  Copy, 
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export const StudentCardModal = ({ student, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !student) return null;

  const qrSrc = student.qrCodeBase64 || api.qr.getImageUrl(student.id);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = `QR_${student.rollNumber}_${student.firstName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = () => {
    const verifyUrl = `${window.location.origin}/#verify/${student.studentUuid}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GraduationCap size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Official Digital Student ID</h3>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Printable Digital ID Badge (Physical-like card layout) */}
          <div 
            className="printable-id-card"
            style={{
              width: '100%',
              maxWidth: '360px',
              borderRadius: '20px',
              background: 'linear-gradient(145deg, #161e31 0%, #0d1322 100%)',
              border: '2px solid rgba(99, 102, 241, 0.4)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '1.5rem 1.25rem',
              color: '#ffffff'
            }}
          >
            {/* Holographic Top Banner */}
            <div style={{
              width: '100%',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.68rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#818cf8',
                textTransform: 'uppercase'
              }}>
                <Sparkles size={12} />
                STATE INSTITUTE OF TECHNOLOGY
              </div>
              <h4 style={{ 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                color: '#e2e8f0', 
                margin: '0.15rem 0 0 0', 
                letterSpacing: '0.04em' 
              }}>
                OFFICIAL STUDENT IDENTITY CARD
              </h4>
            </div>

            {/* Student Avatar + Details */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              marginBottom: '1rem',
              width: '100%'
            }}>
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                border: '3px solid #38bdf8',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.75rem'
              }}>
                {student.firstName[0]}{student.lastName[0]}
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                {student.firstName} {student.lastName}
              </h2>

              <div style={{
                margin: '0.35rem 0',
                background: 'rgba(99, 102, 241, 0.25)',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                padding: '0.2rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#a5b4fc'
              }} className="mono">
                {student.rollNumber}
              </div>

              <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                {student.department}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>
                {student.academicYear || 'Academic Program'} {student.section ? `• Section ${student.section}` : ''}
              </p>
            </div>

            {/* Scannable High-Res QR Code Box */}
            <div style={{
              background: '#ffffff',
              padding: '0.75rem',
              borderRadius: '14px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <img 
                src={qrSrc} 
                alt={`QR code for ${student.rollNumber}`}
                style={{
                  width: '160px',
                  height: '160px',
                  display: 'block'
                }} 
              />
              <span style={{ 
                fontSize: '0.65rem', 
                fontWeight: 700, 
                color: '#0f172a', 
                marginTop: '0.35rem',
                letterSpacing: '0.05em'
              }}>
                SCAN TO VERIFY IDENTITY
              </span>
            </div>

            {/* Quick Detail Badges on ID Card */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              width: '100%',
              fontSize: '0.72rem',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
                <Droplet size={12} color="#f43f5e" />
                <span>Blood: <strong>{student.bloodGroup || 'O+'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
                <Calendar size={12} color="#38bdf8" />
                <span>DOB: <strong>{student.dateOfBirth || '2004-01-01'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
                <ShieldCheck size={12} color="#10b981" />
                <span>Status: <strong style={{ color: '#34d399' }}>{student.status || 'ACTIVE'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1' }}>
                <Phone size={12} color="#fbbf24" />
                <span>Emergency: <strong>{student.guardianPhone ? student.guardianPhone.slice(-5) : 'N/A'}</strong></span>
              </div>
            </div>

            {/* UUID security token label */}
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.62rem',
              color: '#475569',
              textAlign: 'center'
            }} className="mono">
              SECURITY TOKEN: {student.studentUuid}
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button 
            onClick={handleCopyLink} 
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check size={15} color="#10b981" /> : <Copy size={15} />}
            {copied ? 'Link Copied!' : 'Copy Verify URL'}
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleDownloadQr} 
              className="btn btn-secondary btn-sm"
            >
              <Download size={15} />
              Save QR Image
            </button>
            <button 
              onClick={handlePrint} 
              className="btn btn-primary btn-sm"
            >
              <Printer size={15} />
              Print ID Badge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
