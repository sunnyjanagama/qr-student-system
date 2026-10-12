import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { QrScannerView } from './components/QrScannerView';
import { PublicVerifyView } from './components/PublicVerifyView';
import { StudentCardModal } from './components/StudentCardModal';
import { StudentFormModal } from './components/StudentFormModal';
import { LoginModal } from './components/LoginModal';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('eduqr_theme') || 'dark');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedStudentForCard, setSelectedStudentForCard] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [verifyInitialCode, setVerifyInitialCode] = useState('');

  // Handle dark/light theme switching
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('eduqr_theme', theme);
  }, [theme]);

  // Support direct QR URL scanning from mobile: e.g. /#verify/STU-XYZ or /verify/STU-XYZ
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#verify/')) {
        const code = hash.replace('#verify/', '');
        setVerifyInitialCode(code);
        setCurrentTab('verify');
      }
      const path = window.location.pathname;
      if (path.startsWith('/verify/')) {
        const code = path.replace('/verify/', '');
        setVerifyInitialCode(code);
        setCurrentTab('verify');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAddStudent = () => {
    setStudentToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditStudent = (student) => {
    setStudentToEdit(student);
    setIsFormModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        theme={theme}
        setTheme={setTheme}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main View Router */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenAddStudent={handleOpenAddStudent}
          />
        )}

        {currentTab === 'students' && (
          <StudentsView
            onSelectStudentCard={(student) => setSelectedStudentForCard(student)}
            onOpenAddStudent={handleOpenAddStudent}
            onEditStudent={handleOpenEditStudent}
          />
        )}

        {currentTab === 'scanner' && (
          <QrScannerView
            onSelectStudentCard={(student) => setSelectedStudentForCard(student)}
          />
        )}

        {currentTab === 'verify' && (
          <PublicVerifyView
            initialCode={verifyInitialCode}
          />
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <StudentCardModal
        student={selectedStudentForCard}
        isOpen={!!selectedStudentForCard}
        onClose={() => setSelectedStudentForCard(null)}
      />

      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        studentToEdit={studentToEdit}
        onSaved={() => {
          // Trigger refresh event by toggling or re-rendering
          window.dispatchEvent(new Event('refresh-students'));
        }}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0 }}>
          EduQR • Modern Student Information & QR Verification System • Built with React & Spring Boot
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
