import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Award, 
  Activity, 
  User, 
  ShieldCheck, 
  Sparkles,
  QrCode
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const QrScannerView = ({ onSelectStudentCard }) => {
  const { user } = useAuth();

  const [activeMode, setActiveMode] = useState('camera'); // 'camera', 'file', 'manual'
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [verifiedResult, setVerifiedResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [loggedStatus, setLoggedStatus] = useState('');

  const html5QrCodeRef = useRef(null);
  const scannerContainerId = 'reader-container';

  // Trigger celebratory confetti on verified student
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#38bdf8', '#10b981', '#a855f7'],
    });
  };

  const handleQrDecoded = async (decodedText) => {
    // Stop camera temporarily while verifying
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (e) {
        console.warn('Error pausing scanner:', e);
      }
    }

    setVerifying(true);
    setScannerError('');
    setLoggedStatus('');

    try {
      const result = await api.qr.verify(decodedText);
      setVerifiedResult(result);
      if (result.verified) {
        triggerConfetti();
      }
    } catch (err) {
      setScannerError(err.message || 'Verification failed');
      setVerifiedResult(null);
    } finally {
      setVerifying(false);
    }
  };

  // Start live webcam / mobile camera scanner
  const startCamera = async () => {
    setScannerError('');
    setVerifiedResult(null);

    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleQrDecoded(decodedText);
        },
        () => {
          // Ignore periodic frame scanning errors
        }
      );

      setIsScanning(true);
    } catch (err) {
      setScannerError('Could not start camera. Please verify camera permissions or switch to File Upload / Code Lookup.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.warn('Failed to stop camera:', err);
      }
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeMode]);

  // Handle local image file upload scan
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVerifying(true);
    setScannerError('');
    setVerifiedResult(null);

    try {
      const html5QrCode = new Html5Qrcode('file-scanner-temp');
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      await handleQrDecoded(decodedText);
    } catch (err) {
      setScannerError('No valid QR code could be detected in the uploaded image.');
      setVerifying(false);
    }
  };

  const handleManualLookup = (e) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleQrDecoded(manualCode.trim());
  };

  const handleLogAttendance = async (purpose) => {
    if (!verifiedResult || !verifiedResult.verified) return;

    try {
      await api.qr.logScan({
        studentRollNumber: verifiedResult.rollNumber,
        studentName: verifiedResult.fullName,
        purpose: purpose,
        status: 'VALID',
      });
      setLoggedStatus(`Successfully logged ${purpose} record!`);
    } catch (err) {
      alert('Failed to log scan: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center' }}>
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
          marginBottom: '0.5rem'
        }}>
          <Sparkles size={13} />
          <span>AUTHENTICATION & SCANNING PORTAL</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', marginBottom: '0.35rem' }}>
          Interactive QR Code Scanner
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
          Verify student identities in seconds using your device camera, image upload, or roll number.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex',
          background: 'var(--bg-elevated)',
          padding: '0.3rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          gap: '0.4rem'
        }}>
          <button
            onClick={() => setActiveMode('camera')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'camera' ? 'var(--primary)' : 'transparent',
              color: activeMode === 'camera' ? '#ffffff' : 'var(--text-muted)',
              border: 'none'
            }}
          >
            <Camera size={16} /> Live Camera
          </button>
          <button
            onClick={() => setActiveMode('file')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'file' ? 'var(--primary)' : 'transparent',
              color: activeMode === 'file' ? '#ffffff' : 'var(--text-muted)',
              border: 'none'
            }}
          >
            <Upload size={16} /> Image Upload
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className="btn btn-sm"
            style={{
              background: activeMode === 'manual' ? 'var(--primary)' : 'transparent',
              color: activeMode === 'manual' ? '#ffffff' : 'var(--text-muted)',
              border: 'none'
            }}
          >
            <Search size={16} /> Manual Roll No / Code
          </button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: verifiedResult ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Scanner viewport */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          {/* Mode 1: Camera Scanner */}
          {activeMode === 'camera' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '1',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#000000',
                border: '2px solid rgba(99, 102, 241, 0.4)',
                boxShadow: isScanning ? '0 0 25px rgba(99, 102, 241, 0.35)' : 'none'
              }}>
                <div id={scannerContainerId} style={{ width: '100%', height: '100%' }}></div>
                {isScanning && <div className="scan-laser" />}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                {isScanning ? (
                  <button onClick={stopCamera} className="btn btn-secondary btn-sm">
                    Pause Camera
                  </button>
                ) : (
                  <button onClick={startCamera} className="btn btn-primary btn-sm">
                    <Camera size={15} /> Start Camera
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: File Upload Scanner */}
          {activeMode === 'file' && (
            <div style={{
              width: '100%',
              maxWidth: '380px',
              padding: '2.5rem 1.5rem',
              border: '2px dashed rgba(99, 102, 241, 0.4)',
              borderRadius: '16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-elevated)'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Upload size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', margin: 0 }}>Drop student QR image here</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: '0.2rem 0 0 0' }}>
                  Supports PNG, JPG, WebP photos & screenshots
                </p>
              </div>
              <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer', marginTop: '0.5rem' }}>
                Browse Image
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />
              </label>
              <div id="file-scanner-temp" style={{ display: 'none' }}></div>
            </div>
          )}

          {/* Mode 3: Manual Roll No / Code Lookup */}
          {activeMode === 'manual' && (
            <form onSubmit={handleManualLookup} style={{ width: '100%', maxWidth: '380px' }}>
              <div className="form-group">
                <label className="form-label">Enter Roll Number or Verification UUID</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 21CS101 or STU-81829..."
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={verifying}>
                    Verify
                  </button>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                💡 Quick test codes: <code>21CS101</code>, <code>22EC204</code>, <code>23AI310</code>
              </div>
            </form>
          )}

          {/* Scanner Errors or Processing indicator */}
          {verifying && (
            <div style={{ marginTop: '1rem', color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={16} className="animate-spin" /> Verifying cryptographic token...
            </div>
          )}

          {scannerError && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              maxWidth: '380px'
            }}>
              <AlertTriangle size={16} flexShrink={0} />
              <span>{scannerError}</span>
            </div>
          )}
        </div>

        {/* Right Column: Instant Verification Card */}
        {verifiedResult && (
          <div className="glass-card" style={{
            padding: '1.75rem',
            animation: 'slideUp 0.3s ease-out',
            border: verifiedResult.verified ? '2px solid rgba(16, 185, 129, 0.4)' : '2px solid rgba(244, 63, 94, 0.4)',
            boxShadow: verifiedResult.verified ? '0 10px 30px rgba(16, 185, 129, 0.15)' : 'none'
          }}>
            {/* Verification Status Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: verifiedResult.verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                  color: verifiedResult.verified ? '#34d399' : '#fb7185',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {verifiedResult.verified ? <CheckCircle size={22} /> : <AlertTriangle size={22} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: verifiedResult.verified ? '#34d399' : '#fb7185' }}>
                    {verifiedResult.verified ? 'Official Record Authenticated' : 'Invalid Verification'}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Verified on {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>

              <span className={`badge ${verifiedResult.verified ? 'badge-valid' : 'badge-invalid'}`}>
                {verifiedResult.verified ? 'VERIFIED' : 'FAILED'}
              </span>
            </div>

            {verifiedResult.verified ? (
              <div>
                {/* Student Profile Overview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
                  }}>
                    {verifiedResult.fullName ? verifiedResult.fullName[0] : 'S'}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{verifiedResult.fullName}</h2>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8' }} className="mono">
                      {verifiedResult.rollNumber}
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      {verifiedResult.department}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  background: 'var(--bg-elevated)',
                  padding: '0.85rem',
                  borderRadius: '10px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>CGPA</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                      {verifiedResult.cgpa || 'N/A'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>ATTENDANCE</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                      {verifiedResult.attendancePercentage ? `${verifiedResult.attendancePercentage}%` : 'N/A'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block' }}>STATUS</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase' }}>
                      {verifiedResult.status || 'ACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Academic Year:</span>
                    <span style={{ fontWeight: 600 }}>{verifiedResult.academicYear || 'Standard'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Blood Group:</span>
                    <span style={{ fontWeight: 600 }}>{verifiedResult.bloodGroup || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Institutional Email:</span>
                    <span style={{ fontWeight: 600 }}>{verifiedResult.email || 'N/A'}</span>
                  </div>
                </div>

                {loggedStatus && (
                  <div style={{
                    padding: '0.65rem',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    {loggedStatus}
                  </div>
                )}

                {/* Quick Logging Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleLogAttendance('CAMPUS_ENTRY')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Log Entry
                    </button>
                    <button
                      onClick={() => handleLogAttendance('ATTENDANCE')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Log Attendance
                    </button>
                    <button
                      onClick={() => handleLogAttendance('LIBRARY_ACCESS')}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Log Library
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setVerifiedResult(null);
                      if (activeMode === 'camera') startCamera();
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.5rem' }}
                  >
                    Scan Another Student
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  {verifiedResult.message}
                </p>
                <button
                  onClick={() => {
                    setVerifiedResult(null);
                    if (activeMode === 'camera') startCamera();
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '1rem' }}
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
