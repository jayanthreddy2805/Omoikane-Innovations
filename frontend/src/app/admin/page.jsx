'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styles from './admin.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' | 'careers'
  const [contacts, setContacts] = useState([]);
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const loadData = React.useCallback(async (keyToUse) => {
    setIsLoading(true);
    try {
      const [contactsRes, careersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/contacts`, {
          headers: { 'X-Admin-Key': keyToUse },
        }),
        fetch(`${API_BASE_URL}/api/admin/careers`, {
          headers: { 'X-Admin-Key': keyToUse },
        }),
      ]);

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData);
      }
      if (careersRes.ok) {
        const careersData = await careersRes.json();
        setCareers(careersData);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyAndLoad = React.useCallback(async (key) => {
    setIsVerifying(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': key,
        },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        setAdminKey(key);
        sessionStorage.setItem('omoikane_admin_key', key);
        loadData(key);
      } else {
        setAuthError('Invalid admin secret key. Please try again.');
        sessionStorage.removeItem('omoikane_admin_key');
        setIsAuthenticated(false);
      }
    } catch {
      setAuthError('Unable to connect to the backend server. Is it running?');
    } finally {
      setIsVerifying(false);
    }
  }, [loadData]);

  // Check saved session on mount
  useEffect(() => {
    let isMounted = true;
    const savedKey = typeof window !== 'undefined' ? sessionStorage.getItem('omoikane_admin_key') : null;
    if (!savedKey) return;

    fetch(`${API_BASE_URL}/api/admin/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': savedKey,
      },
    })
      .then((res) => {
        if (!isMounted) return;
        if (res.ok) {
          setIsAuthenticated(true);
          setAdminKey(savedKey);
          loadData(savedKey);
        } else {
          sessionStorage.removeItem('omoikane_admin_key');
        }
      })
      .catch(() => {
        // Silent catch on initial mount restore
      });

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAdminKey(keyInput.trim());
    verifyAndLoad(keyInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('omoikane_admin_key');
    setAdminKey('');
    setKeyInput('');
    setIsAuthenticated(false);
    setContacts([]);
    setCareers([]);
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact submission?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey },
      });
      if (res.ok) {
        setContacts((prev) => prev.filter((item) => item.id !== id));
        if (selectedDetail?.id === id) setSelectedDetail(null);
      }
    } catch (err) {
      alert('Failed to delete submission');
    }
  };

  const handleDeleteCareer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this career application?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/careers/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey },
      });
      if (res.ok) {
        setCareers((prev) => prev.filter((item) => item.id !== id));
        if (selectedDetail?.id === id) setSelectedDetail(null);
      }
    } catch (err) {
      alert('Failed to delete application');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Filtered lists
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts;
    const term = searchTerm.toLowerCase();
    return contacts.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.company?.toLowerCase().includes(term) ||
        c.message?.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

  const filteredCareers = useMemo(() => {
    if (!searchTerm.trim()) return careers;
    const term = searchTerm.toLowerCase();
    return careers.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.department?.toLowerCase().includes(term) ||
        c.roleTitle?.toLowerCase().includes(term) ||
        c.message?.toLowerCase().includes(term)
    );
  }, [careers, searchTerm]);

  // ── Render Login Screen if not authenticated ──
  if (!isAuthenticated) {
    return (
      <div className={styles.adminWrapper}>
        <div className={styles.ambientGlow} />
        <div className={styles.ambientGlowLeft} />

        <div className={styles.loginContainer}>
          <div className={styles.loginCard}>
            <div className={styles.loginLogo}>
              <div className={styles.loginLogoIcon}>Ω</div>
              <span className={styles.loginLogoText}>Omoikane Innovations</span>
            </div>

            <h1 className={styles.loginTitle}>Manager & Admin Portal</h1>
            <p className={styles.loginSubtitle}>
              Enter your admin secret key to access incoming customer enquiries and candidate resumes.
            </p>

            <form onSubmit={handleLoginSubmit} className={styles.loginForm}>
              {authError && <div className={styles.errorBanner}>{authError}</div>}

              <div>
                <label className={styles.inputLabel} htmlFor="adminKey">
                  Admin Key / Password
                </label>
                <input
                  id="adminKey"
                  type="password"
                  placeholder="Enter secret key..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className={styles.passwordInput}
                  autoFocus
                />
              </div>

              <button type="submit" disabled={isVerifying || !keyInput} className={styles.loginBtn}>
                {isVerifying ? 'Verifying Key...' : 'Unlock Dashboard →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Authenticated Dashboard ──
  return (
    <div className={styles.adminWrapper}>
      <div className={styles.ambientGlow} />
      <div className={styles.ambientGlowLeft} />

      {/* Top Navbar */}
      <nav className={styles.topNav}>
        <div className={styles.navContainer}>
          <div className={styles.brandGroup}>
            <div className={styles.brandLogo}>Ω</div>
            <div>
              <span className={styles.brandTitle}>Omoikane Operations</span>
            </div>
            <span className={styles.portalBadge}>Admin Mode</span>
          </div>

          <div className={styles.navActions}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              <span>Database Connected</span>
            </div>
            <button onClick={() => loadData(adminKey)} className={styles.actionBtn}>
              ↻ Refresh
            </button>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContainer}>
        {/* Metric Overview Cards */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>✉</div>
            <div>
              <div className={styles.metricValue}>{contacts.length}</div>
              <div className={styles.metricLabel}>Contact Enquiries</div>
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>💼</div>
            <div>
              <div className={styles.metricValue}>{careers.length}</div>
              <div className={styles.metricLabel}>Job Applications</div>
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>📄</div>
            <div>
              <div className={styles.metricValue}>
                {careers.filter((c) => c.resumeFilename).length}
              </div>
              <div className={styles.metricLabel}>Candidate Resumes Stored</div>
            </div>
          </div>
        </div>

        {/* Tab & Search Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.tabsGroup}>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${styles.tabBtn} ${activeTab === 'contacts' ? styles.activeTab : ''}`}
            >
              Contact Enquiries <span className={styles.tabBadge}>{contacts.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('careers')}
              className={`${styles.tabBtn} ${activeTab === 'careers' ? styles.activeTab : ''}`}
            >
              Career Applications <span className={styles.tabBadge}>{careers.length}</span>
            </button>
          </div>

          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder={`Search ${activeTab === 'contacts' ? 'enquiries' : 'applicants'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Tables */}
        <div className={styles.tableCard}>
          {isLoading ? (
            <div className={styles.emptyState}>
              <div>Loading records from PostgreSQL...</div>
            </div>
          ) : activeTab === 'contacts' ? (
            /* ── Contacts Table ── */
            <div className={styles.tableResponsive}>
              {filteredContacts.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>✉</div>
                  <div>No contact enquiries found.</div>
                </div>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Company</th>
                      <th>Contact Info</th>
                      <th>Received</th>
                      <th>Message Snippet</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className={styles.primaryText}>{c.name}</div>
                          <div className={styles.secondaryText}>ID #{c.id}</div>
                        </td>
                        <td>
                          {c.company ? (
                            <span className={`${styles.tag} ${styles.tagBlue}`}>{c.company}</span>
                          ) : (
                            <span className={styles.secondaryText}>Individual</span>
                          )}
                        </td>
                        <td>
                          <div>
                            <a
                              href={`mailto:${c.email}`}
                              style={{ color: '#38bdf8', textDecoration: 'none' }}
                            >
                              {c.email}
                            </a>
                            <button
                              onClick={() => copyToClipboard(c.email, c.id)}
                              style={{
                                marginLeft: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: copiedId === c.id ? '#10b981' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '11px',
                              }}
                              title="Copy email"
                            >
                              {copiedId === c.id ? '✓ Copied' : '📋'}
                            </button>
                          </div>
                          {c.phone && <div className={styles.secondaryText}>📞 {c.phone}</div>}
                        </td>
                        <td>{formatDate(c.createdAt)}</td>
                        <td>
                          <div
                            style={{
                              maxWidth: '280px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: '#94a3b8',
                            }}
                          >
                            {c.message}
                          </div>
                        </td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              onClick={() => setSelectedDetail({ type: 'contact', data: c })}
                              className={styles.viewBtn}
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteContact(c.id)}
                              className={styles.deleteBtn}
                              title="Delete submission"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            /* ── Careers Table ── */
            <div className={styles.tableResponsive}>
              {filteredCareers.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>💼</div>
                  <div>No career applications found.</div>
                </div>
              ) : (
                <table className={styles.dataTable}>
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Position Applied</th>
                      <th>Department</th>
                      <th>Contact</th>
                      <th>Resume</th>
                      <th>Applied At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCareers.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className={styles.primaryText}>{app.name}</div>
                          <div className={styles.secondaryText}>ID #{app.id}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#f1f5f9' }}>
                            {app.roleTitle || app.roleId}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`${styles.tag} ${
                              app.department === 'software'
                                ? styles.tagBlue
                                : app.department === 'electronics'
                                ? styles.tagPurple
                                : styles.tagOrange
                            }`}
                          >
                            {app.department ? app.department.toUpperCase() : 'GENERAL'}
                          </span>
                        </td>
                        <td>
                          <div>
                            <a
                              href={`mailto:${app.email}`}
                              style={{ color: '#38bdf8', textDecoration: 'none' }}
                            >
                              {app.email}
                            </a>
                            <button
                              onClick={() => copyToClipboard(app.email, app.id)}
                              style={{
                                marginLeft: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: copiedId === app.id ? '#10b981' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '11px',
                              }}
                              title="Copy email"
                            >
                              {copiedId === app.id ? '✓ Copied' : '📋'}
                            </button>
                          </div>
                          {app.phone && <div className={styles.secondaryText}>📞 {app.phone}</div>}
                        </td>
                        <td>
                          {app.resumeFilename ? (
                            <a
                              href={`${API_BASE_URL}/api/admin/careers/${app.id}/resume?key=${encodeURIComponent(
                                adminKey
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.downloadBtn}
                              title="Download attached resume"
                            >
                              ⬇ {app.resumeFilename}
                            </a>
                          ) : (
                            <span className={styles.secondaryText}>None</span>
                          )}
                        </td>
                        <td>{formatDate(app.createdAt)}</td>
                        <td>
                          <div className={styles.rowActions}>
                            <button
                              onClick={() => setSelectedDetail({ type: 'career', data: app })}
                              className={styles.viewBtn}
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteCareer(app.id)}
                              className={styles.deleteBtn}
                              title="Delete application"
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDetail(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedDetail.type === 'contact' ? 'Contact Enquiry' : 'Career Application'}{' '}
                #{selectedDetail.data.id}
              </h2>
              <button onClick={() => setSelectedDetail(null)} className={styles.closeBtn}>
                ✕
              </button>
            </div>

            {selectedDetail.type === 'contact' ? (
              <div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Sender:</div>
                  <div className={styles.detailValue}>{selectedDetail.data.name}</div>
                </div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Email:</div>
                  <div className={styles.detailValue}>
                    <a
                      href={`mailto:${selectedDetail.data.email}`}
                      style={{ color: '#00E5FF', textDecoration: 'none' }}
                    >
                      {selectedDetail.data.email}
                    </a>
                  </div>
                </div>
                {selectedDetail.data.phone && (
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Phone:</div>
                    <div className={styles.detailValue}>{selectedDetail.data.phone}</div>
                  </div>
                )}
                {selectedDetail.data.company && (
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Company:</div>
                    <div className={styles.detailValue}>{selectedDetail.data.company}</div>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Received:</div>
                  <div className={styles.detailValue}>
                    {formatDate(selectedDetail.data.createdAt)}
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div className={styles.inputLabel}>Full Message:</div>
                  <div className={styles.messageBox}>{selectedDetail.data.message}</div>
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Applicant:</div>
                  <div className={styles.detailValue}>{selectedDetail.data.name}</div>
                </div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Email:</div>
                  <div className={styles.detailValue}>
                    <a
                      href={`mailto:${selectedDetail.data.email}`}
                      style={{ color: '#00E5FF', textDecoration: 'none' }}
                    >
                      {selectedDetail.data.email}
                    </a>
                  </div>
                </div>
                {selectedDetail.data.phone && (
                  <div className={styles.detailRow}>
                    <div className={styles.detailLabel}>Phone:</div>
                    <div className={styles.detailValue}>{selectedDetail.data.phone}</div>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Position:</div>
                  <div className={styles.detailValue}>
                    {selectedDetail.data.roleTitle || selectedDetail.data.roleId} (
                    {selectedDetail.data.department})
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Applied:</div>
                  <div className={styles.detailValue}>
                    {formatDate(selectedDetail.data.createdAt)}
                  </div>
                </div>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>Resume:</div>
                  <div className={styles.detailValue}>
                    <a
                      href={`${API_BASE_URL}/api/admin/careers/${
                        selectedDetail.data.id
                      }/resume?key=${encodeURIComponent(adminKey)}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.downloadBtn}
                    >
                      ⬇ Download {selectedDetail.data.resumeFilename}
                    </a>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div className={styles.inputLabel}>Cover Letter / Message:</div>
                  <div className={styles.messageBox}>{selectedDetail.data.message}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
