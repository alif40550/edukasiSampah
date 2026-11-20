'use client';

import { useState, useEffect } from 'react';

export default function AttendanceModal({ onCompleted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    // Check local storage for today's attendance
    const savedAttendance = localStorage.getItem('kampoeng_radja_attendance');
    if (savedAttendance) {
      try {
        const parsed = JSON.parse(savedAttendance);
        if (parsed.date === todayStr) {
          // Already attended today
          setIsOpen(false);
          return;
        }
      } catch (e) {
        // invalid data, prompt attendance
      }
    }
    setIsOpen(true);
  }, [todayStr]);

  // Google OAuth Client setup via Google Identity Services
  useEffect(() => {
    if (!isOpen) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (window.google && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse,
        });
        const googleBtnDiv = document.getElementById('googleSignInDiv');
        if (googleBtnDiv) {
          const btnWidth = Math.min(380, Math.max(220, window.innerWidth - 64));
          window.google.accounts.id.renderButton(googleBtnDiv, {
            theme: 'outline',
            size: 'large',
            width: btnWidth,
            text: 'signin_with',
            shape: 'rectangular',
          });
        }
      } catch (err) {
        console.warn('Google GIS init error:', err);
      }
    }
  }, [isOpen]);

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setLoading(true);
      // Decode JWT payload without external library
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const profile = JSON.parse(jsonPayload);

      await submitAttendance({
        name: profile.name || 'Pengguna Google',
        email: profile.email,
        institution: 'Google Account',
        avatar_url: profile.picture || '',
        auth_provider: 'google',
      });
    } catch (err) {
      setErrorMessage('Gagal memproses login Google: ' + err.message);
      setLoading(false);
    }
  };

  const handleQuickGoogleSim = async () => {
    // Instant Google OAuth simulation for demo/testing without mandatory GCP credentials
    const simulatedEmail = `pengunjung_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    await submitAttendance({
      name: 'Pengunjung Google (Simulasi Cepat)',
      email: simulatedEmail,
      institution: 'Wisatawan Umum Jambi',
      avatar_url: '',
      auth_provider: 'google',
    });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('Nama dan email wajib diisi!');
      return;
    }
    await submitAttendance({
      name: name.trim(),
      email: email.trim(),
      institution: institution.trim() || 'Umum',
      avatar_url: '',
      auth_provider: 'manual',
    });
  };

  const submitAttendance = async (data) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Gagal menyimpan kehadiran');
      }

      // Save to localStorage for today
      localStorage.setItem(
        'kampoeng_radja_attendance',
        JSON.stringify({
          date: todayStr,
          name: data.name,
          email: data.email,
        })
      );

      setIsOpen(false);
      if (onCompleted) onCompleted(data);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="attendance-overlay">
      <div className="attendance-card">
        <div className="attendance-header">
          <span className="badge-pill">Daftar Hadir Pengunjung</span>
          <h2>Selamat Datang!</h2>
          <p>
            Mohon isi daftar hadir kunjungan Anda sebelum mengakses modul edukasi pengelolaan sampah Kampoeng Radja Jambi.
          </p>
        </div>

        {errorMessage && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {errorMessage}
          </div>
        )}

        <div className="google-btn-wrapper">
          <div id="googleSignInDiv" style={{ display: 'flex', justifyContent: 'center' }}></div>
          {/* <button
            type="button"
            className="btn-google"
            onClick={handleQuickGoogleSim}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Masuk dengan Google (1-Klik Cepat)
          </button> */}
        </div>

        <div className="divider-text">
          <span>atau isi form manual</span>
        </div>

        <form onSubmit={handleManualSubmit}>
          <div className="form-group">
            <label htmlFor="attName">Nama Lengkap *</label>
            <input
              id="attName"
              type="text"
              className="form-input"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="attEmail">Alamat Email *</label>
            <input
              id="attEmail"
              type="email"
              className="form-input"
              placeholder="budi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="attInst">Asal / Instansi / Sekolah (Opsional)</label>
            <input
              id="attInst"
              type="text"
              className="form-input"
              placeholder="Contoh: SMPN 1 Jambi / Umum"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--block"
            disabled={loading}
            style={{ marginTop: '1.25rem' }}
          >
            {loading ? 'Menyimpan...' : 'Kirim Daftar Hadir & Lanjut'}
          </button>
        </form>
      </div>
    </div>
  );
}

