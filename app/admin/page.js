"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Login form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Visits data state
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dbMode, setDbMode] = useState("mysql");

  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState("all"); // 'all', 'google', 'manual', 'anonymous'
  const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 1. Check existing session on mount
  useEffect(() => {
    checkAuthSession();
  }, []);

  // Reset ke halaman 1 ketika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterProvider, filterDate, itemsPerPage]);


  const checkAuthSession = async () => {
    try {
      setAuthChecking(true);
      const res = await fetch("/api/admin/auth");
      if (res.ok) {
        setIsAuthenticated(true);
        fetchVisits();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Username atau password tidak sesuai");
      }

      setIsAuthenticated(true);
      fetchVisits();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/visits");
      const data = await res.json();
      setVisits(data.visits || []);
      setDbMode(data.mode || "mysql");
    } catch (err) {
      console.error("Fetch visits error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state while checking authentication
  if (authChecking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-gray-50)" }}>
        <div style={{ textAlign: "center", color: "var(--color-dark-muted)" }}>
          <p style={{ fontWeight: 600 }}>Memverifikasi sesi admin...</p>
        </div>
      </div>
    );
  }

  // 2. Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #09261a 0%, #113d2b 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ background: "#ffffff", borderRadius: "18px", maxWidth: "420px", width: "100%", padding: "2.5rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "var(--color-forest)",
                color: "#34d399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 4px 10px rgba(13,56,38,0.2)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <span className="badge-pill" style={{ marginBottom: "0.4rem", display: "inline-block" }}>
              Akses Khusus
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "var(--color-dark)", marginBottom: "0.3rem" }}>Login Admin</h1>
            <p style={{ fontSize: "0.85rem", color: "var(--color-gray-600)" }}>Edukasi Sampah x Kampoeng Radja Jambi</p>
          </div>

          {loginError && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1.25rem", border: "1px solid #fecaca" }}>{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="adminUser">Username Admin</label>
              <input id="adminUser" type="text" className="form-input" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="adminPass">Password</label>
              <input id="adminPass" type="password" className="form-input" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn--primary btn--block" disabled={loginLoading}>
              {loginLoading ? "Memverifikasi..." : "Masuk ke Dashboard Admin"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", textAlign: "center", paddingTop: "1.25rem", borderTop: "1px solid var(--color-gray-100)" }}>
            <Link href="/" style={{ fontSize: "0.85rem", color: "var(--color-forest)", fontWeight: 600 }}>
              &larr; Kembali ke Beranda Pengunjung
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Render Admin Dashboard if authenticated
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const totalVisits = visits.length;
  const todayVisits = visits.filter((v) => {
    const vDate = v.visit_date ? String(v.visit_date).slice(0, 10) : "";
    return vDate === todayStr;
  }).length;
  const googleVisits = visits.filter((v) => v.auth_provider === "google").length;

  const formatDisplayDate = (rawDate) => {
    if (!rawDate) return "-";
    // If it's a date string like "2026-11-20" or ISO string
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return String(rawDate).slice(0, 10);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDisplayTime = (rawTime) => {
    if (!rawTime) return "-";
    const d = new Date(rawTime);
    if (isNaN(d.getTime())) return "-";
    return (
      d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB"
    );
  };

  // Export to Excel-compatible CSV with UTF-8 BOM
  const exportToExcel = () => {
    if (!visits || visits.length === 0) return;

    // Header baris tabel Excel
    const headers = ["No", "Nama Pengunjung", "Email", "Asal / Instansi", "Metode Masuk", "Tanggal Kunjungan", "Waktu Akses"];

    // Baris-baris data
    const rows = visits.map((item, idx) => {
      const timeStr = item.created_at ? formatDisplayTime(item.created_at) : "-";
      const provider = item.auth_provider === "google" ? "Google OAuth" : "Form Manual";
      const isAnon = item.email?.endsWith("@anonymous.local") || item.name?.includes("***");
      const displayEmail = isAnon ? "-" : item.email || "-";
      const displayInst = isAnon ? "-" : item.institution || "-";

      return [
        idx + 1,
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${displayEmail.replace(/"/g, '""')}"`,
        `"${displayInst.replace(/"/g, '""')}"`,
        `"${provider}"`,
        `"${formatDisplayDate(item.visit_date)}"`,
        `"${timeStr}"`,
      ];
    });

    // Gabungkan dengan pemisah koma / semikolon standar CSV
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    // Tambahkan UTF-8 Byte Order Mark (\uFEFF) agar Microsoft Excel membaca huruf & karakter Indonesia dengan sempurna
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const now = new Date();
    const todayFilename = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    link.href = url;
    link.setAttribute("download", `Daftar_Pengunjung_Kampoeng_Radja_${todayFilename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const filteredVisits = visits.filter((v) => {
    const isAnon = v.email?.endsWith("@anonymous.local") || v.name?.includes("***");

    // Filter Tipe / Metode Masuk
    if (filterProvider === "google" && v.auth_provider !== "google") return false;
    if (filterProvider === "manual" && (v.auth_provider !== "manual" || isAnon)) return false;
    if (filterProvider === "anonymous" && !isAnon) return false;

    // Filter Tanggal
    if (filterDate) {
      const vDate = v.visit_date ? String(v.visit_date).slice(0, 10) : "";
      if (vDate !== filterDate) return false;
    }

    // Filter Pencarian Teks
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = v.name && v.name.toLowerCase().includes(q);
      const matchEmail = !isAnon && v.email && v.email.toLowerCase().includes(q);
      const matchInst = !isAnon && v.institution && v.institution.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchInst) return false;
    }

    return true;
  });

  // Kalkulasi Pagination
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage) || 1;
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedVisits = filteredVisits.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="admin-layout">
      {/* Top Navbar */}
      <header className="admin-nav">
        <div className="container admin-nav__inner">
          <div className="admin-header-title">
            <Link href="/" className="brand" style={{ color: "#ffffff" }}>
              <div className="brand__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M7 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"></path>
                  <path d="M12 9v6"></path>
                  <path d="M9 12h6"></path>
                </svg>
              </div>
              <div className="brand__text">
                <span className="brand__title" style={{ color: "#ffffff" }}>
                  EdukasiSampah Admin
                </span>
                <span className="brand__subtitle" style={{ color: "#a7f3d0" }}>
                  Mitra Kampoeng Radja Jambi
                </span>
              </div>
            </Link>
            <span className="admin-badge">Admin Dashboard</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span style={{ fontSize: "0.8rem", color: dbMode === "mysql" ? "#34d399" : "#fef08a" }}>
              DB: <strong>{dbMode.toUpperCase()}</strong>
            </span>
            <Link href="/" className="btn btn--outline btn--sm" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#ffffff" }}>
              Lihat Web
            </Link>
            <button onClick={handleLogout} className="btn btn--sm" style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-content">
        <div className="container">
          <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.85rem", fontWeight: 800, color: "var(--color-dark)" }}>Daftar Pengunjung & Kehadiran Harian</h1>
              <p style={{ color: "var(--color-gray-600)", fontSize: "0.92rem" }}>Menampilkan pengunjung yang telah mengisi formulir kehadiran sebelum mengakses website.</p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={exportToExcel}
                className="btn btn--primary btn--sm"
                disabled={loading || visits.length === 0}
                style={{ background: "#166534", display: "inline-flex", alignItems: "center", gap: "0.45rem" }}
                title="Download data pengunjung ke format Excel (.xlsx / .csv)"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Ekspor ke Excel (.CSV)
              </button>
              <button onClick={fetchVisits} className="btn btn--secondary btn--sm" disabled={loading}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
                {loading ? "Menyinkronkan..." : "Refresh Data"}
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card__label">Total Kunjungan Tercatat</div>
              <div className="stat-card__val">{totalVisits}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Kunjungan Hari Ini ({todayStr})</div>
              <div className="stat-card__val" style={{ color: "var(--color-forest)" }}>
                {todayVisits}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Login Google OAuth</div>
              <div className="stat-card__val" style={{ color: "#0284c7" }}>
                {googleVisits}
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="table-card">
            <div className="table-card__header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                <strong style={{ fontSize: "1.05rem", color: "var(--color-dark)" }}>Data Presensi User</strong>
                <span style={{ fontSize: "0.8rem", background: "var(--color-gray-100)", padding: "0.2rem 0.55rem", borderRadius: "4px", fontWeight: 600 }}>
                  {filteredVisits.length} record {filteredVisits.length !== visits.length && `(dari ${visits.length})`}
                </span>
              </div>

              {/* Filtering Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                {/* Search Input */}
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Cari nama, email, asal..."
                    className="form-input"
                    style={{ width: "220px", padding: "0.45rem 0.75rem", fontSize: "0.85rem" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-gray-400)",
                        fontSize: "0.85rem",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter Metode / Tipe */}
                <select
                  className="form-input"
                  style={{ width: "auto", padding: "0.45rem 0.75rem", fontSize: "0.85rem", cursor: "pointer" }}
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                >
                  <option value="all">Semua Metode</option>
                  <option value="google">Google OAuth</option>
                  <option value="manual">Form Manual</option>
                  <option value="anonymous">Anonim</option>
                </select>

                {/* Filter Tanggal */}
                <input
                  type="date"
                  className="form-input"
                  style={{ width: "auto", padding: "0.42rem 0.75rem", fontSize: "0.85rem", cursor: "pointer" }}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  title="Filter berdasarkan tanggal kunjungan"
                />

                {/* Reset Filter Button */}
                {(searchTerm || filterProvider !== "all" || filterDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterProvider("all");
                      setFilterDate("");
                    }}
                    className="btn btn--sm"
                    style={{
                      background: "var(--color-gray-100)",
                      color: "var(--color-gray-600)",
                      fontSize: "0.8rem",
                      padding: "0.45rem 0.75rem",
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Pengunjung</th>
                    <th>Email</th>
                    <th>Asal / Instansi</th>
                    <th>Metode Masuk</th>
                    <th>Tanggal Kunjungan</th>
                    <th>Waktu Akses</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && visits.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem" }}>
                        Memuat data pengunjung...
                      </td>
                    </tr>
                  ) : filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2.5rem", color: "var(--color-gray-600)" }}>
                        Belum ada data kunjungan yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    paginatedVisits.map((item, index) => {
                      const isAnon = item.email?.endsWith("@anonymous.local") || item.name?.includes("***");
                      const displayEmail = isAnon ? "-" : item.email;
                      const displayInst = isAnon ? "-" : (item.institution || "-");
                      const rowNumber = startIndex + index + 1;

                      return (
                        <tr key={item.id || rowNumber}>
                          <td style={{ color: "var(--color-gray-600)", width: "50px" }}>{rowNumber}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                              <div
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  background: isAnon ? "var(--color-gray-400)" : "var(--color-forest)",
                                  color: isAnon ? "#ffffff" : "#a7f3d0",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                }}
                              >
                                {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <strong style={{ color: "var(--color-dark)" }}>{item.name}</strong>
                            </div>
                          </td>
                          <td>{displayEmail}</td>
                          <td>{displayInst}</td>
                          <td>
                            <span className={`provider-badge ${item.auth_provider === "google" ? "provider-badge--google" : "provider-badge--manual"}`}>{item.auth_provider === "google" ? "Google OAuth" : "Form Manual"}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: "var(--color-dark)" }}>{formatDisplayDate(item.visit_date)}</span>
                          </td>
                          <td style={{ fontSize: "0.85rem", color: "var(--color-gray-600)" }}>{formatDisplayTime(item.created_at)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredVisits.length > 0 && (
              <div
                style={{
                  padding: "1rem 1.75rem",
                  borderTop: "1px solid var(--color-gray-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "var(--color-gray-600)" }}>
                  <span>
                    Menampilkan <strong>{filteredVisits.length === 0 ? 0 : startIndex + 1}</strong> - <strong>{Math.min(startIndex + itemsPerPage, filteredVisits.length)}</strong> dari <strong>{filteredVisits.length}</strong> data
                  </span>
                  <span>•</span>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>Baris per halaman:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        border: "1px solid var(--color-gray-300)",
                        fontSize: "0.82rem",
                        cursor: "pointer",
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={validCurrentPage <= 1}
                    className="btn btn--sm"
                    style={{
                      padding: "0.35rem 0.75rem",
                      background: validCurrentPage <= 1 ? "var(--color-gray-100)" : "#ffffff",
                      border: "1px solid var(--color-gray-300)",
                      color: validCurrentPage <= 1 ? "var(--color-gray-400)" : "var(--color-dark)",
                      cursor: validCurrentPage <= 1 ? "not-allowed" : "pointer",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    ← Sebelumnya
                  </button>

                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        return page === 1 || page === totalPages || Math.abs(page - validCurrentPage) <= 1;
                      })
                      .map((page, idx, arr) => {
                        const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                        return (
                          <div key={page} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            {showEllipsisBefore && <span style={{ padding: "0 0.25rem", color: "var(--color-gray-400)" }}>...</span>}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              style={{
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "6px",
                                border: page === validCurrentPage ? "1px solid var(--color-primary)" : "1px solid var(--color-gray-200)",
                                background: page === validCurrentPage ? "var(--color-primary)" : "#ffffff",
                                color: page === validCurrentPage ? "#ffffff" : "var(--color-dark)",
                                fontWeight: page === validCurrentPage ? 700 : 500,
                                fontSize: "0.82rem",
                                cursor: "pointer",
                              }}
                            >
                              {page}
                            </button>
                          </div>
                        );
                      })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={validCurrentPage >= totalPages}
                    className="btn btn--sm"
                    style={{
                      padding: "0.35rem 0.75rem",
                      background: validCurrentPage >= totalPages ? "var(--color-gray-100)" : "#ffffff",
                      border: "1px solid var(--color-gray-300)",
                      color: validCurrentPage >= totalPages ? "var(--color-gray-400)" : "var(--color-dark)",
                      cursor: validCurrentPage >= totalPages ? "not-allowed" : "pointer",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                    }}
                  >
                    Berikutnya →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
