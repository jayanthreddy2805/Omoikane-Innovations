'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './admin.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState('careers'); // Default to 'careers' or 'contacts'
  const [deptFilter, setDeptFilter] = useState('all');
  const [contacts, setContacts] = useState([]);
  const [careers, setCareers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'contact' | 'career', item }
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const loadData = useCallback(async (keyToUse) => {
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
      setIsRefreshing(false);
    }
  }, []);

  const verifyAndLoad = useCallback(
    async (key) => {
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
          setAuthError('Invalid admin secret key. Please check your credentials and try again.');
          sessionStorage.removeItem('omoikane_admin_key');
          setIsAuthenticated(false);
        }
      } catch {
        setAuthError('Unable to connect to the backend server. Please verify the Spring Boot service is active.');
      } finally {
        setIsVerifying(false);
      }
    },
    [loadData]
  );

  // Check saved session on initial mount
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
    verifyAndLoad(keyInput.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('omoikane_admin_key');
    setAdminKey('');
    setKeyInput('');
    setIsAuthenticated(false);
    setContacts([]);
    setCareers([]);
    setSelectedDetail(null);
    setDeleteTarget(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData(adminKey);
  };

  // Execution of Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const { type, item } = deleteTarget;

    try {
      const endpoint =
        type === 'contact'
          ? `${API_BASE_URL}/api/admin/contacts/${item.id}`
          : `${API_BASE_URL}/api/admin/careers/${item.id}`;

      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey },
      });

      if (res.ok) {
        if (type === 'contact') {
          setContacts((prev) => prev.filter((c) => c.id !== item.id));
        } else {
          setCareers((prev) => prev.filter((c) => c.id !== item.id));
        }

        if (selectedDetail?.data?.id === item.id) {
          setSelectedDetail(null);
        }
        setDeleteTarget(null);
      } else {
        alert('Failed to delete item. Server returned an error.');
      }
    } catch (err) {
      alert('Network error while deleting item.');
    } finally {
      setIsDeleting(false);
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

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getInitials = (name) => {
    if (!name) return 'Ω';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
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
        c.phone?.toLowerCase().includes(term) ||
        c.message?.toLowerCase().includes(term)
    );
  }, [contacts, searchTerm]);

  const filteredCareers = useMemo(() => {
    let result = careers;
    if (deptFilter !== 'all') {
      result = result.filter((c) => c.department?.toLowerCase() === deptFilter.toLowerCase());
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.roleTitle?.toLowerCase().includes(term) ||
          c.roleId?.toLowerCase().includes(term) ||
          c.phone?.toLowerCase().includes(term) ||
          c.message?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [careers, deptFilter, searchTerm]);

  // Total Resumes Stored
  const totalResumes = useMemo(() => {
    return careers.filter((c) => c.resumeFilename).length;
  }, [careers]);

  // ─────────────────────────────────────────────────────────────
  // RENDER AUTHENTICATION GATE IF NOT LOGGED IN
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.ambientBlurTop} />
        <div className={styles.ambientBlurBottom} />

        <div className={styles.container}>
          <div className={styles.authContainer}>
            <div className={styles.authCard}>
              <div className={styles.authBadge}>
                <span className={styles.authBadgeDot} />
                <span>Internal Security Gate</span>
              </div>

              <h1 className={styles.authTitle}>
                OPERATIONS <span>CONSOLE</span>
              </h1>
              <p className={styles.authSubtitle}>
                Clearance required. Enter your management secret key to review client mission inquiries and candidate talent archives.
              </p>

              <form onSubmit={handleLoginSubmit} className={styles.authForm}>
                {authError && (
                  <div className={styles.errorBanner}>
                    <span>⚠️</span>
                    <span>{authError}</span>
                  </div>
                )}

                <div className={styles.formGroup}>
                  <label className={styles.formLabel} htmlFor="adminKey">
                    Management Secret Key
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="adminKey"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter security key..."
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      className={styles.passwordInput}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={styles.togglePassBtn}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '👁️' : '🔒'}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isVerifying || !keyInput} className={styles.authSubmitBtn}>
                  {isVerifying ? 'Authenticating Clearance...' : 'Access Management Console →'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER AUTHENTICATED ENTERPRISE CONSOLE
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.ambientBlurTop} />
      <div className={styles.ambientBlurBottom} />

      <div className={styles.container}>
        {/* 1. HERO & SYSTEM HEADER */}
        <div className={styles.heroHeader}>
          <div className={styles.heroLeft}>
            <div className={styles.sectionCategory}>
              <span>SECURE OPERATIONS</span>
              <span>•</span>
              <span>ENTERPRISE REPOSITORY</span>
            </div>
            <h1 className={styles.heroTitle}>
              OPERATIONS <span>CONSOLE</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Live administrative management for inbound commercial partnerships, defense inquiries, and candidate talent archives.
            </p>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.systemBadge}>
              <span className={styles.pulsingDot} />
              <span>POSTGRESQL • CONNECTED</span>
            </div>
            <button onClick={handleRefresh} className={styles.refreshBtn} title="Sync latest data">
              <span className={isRefreshing ? styles.spinning : ''}>↻</span>
              <span>Sync Data</span>
            </button>
            <button onClick={handleLogout} className={styles.lockBtn} title="End session">
              <span>🔒 Lock Console</span>
            </button>
          </div>
        </div>

        {/* 2. MNC KPI METRICS OVERVIEW */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Candidate Applications</span>
              <span className={styles.kpiValue}>{careers.length}</span>
              <span className={styles.kpiMeta}>Talent pipeline active</span>
            </div>
            <div className={styles.kpiIconBox}>💼</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Candidate Resumes</span>
              <span className={styles.kpiValue}>{totalResumes}</span>
              <span className={styles.kpiMeta}>Stored in database</span>
            </div>
            <div className={styles.kpiIconBox}>📄</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>Client Inquiries</span>
              <span className={styles.kpiValue}>{contacts.length}</span>
              <span className={styles.kpiMeta}>Enterprise & mission leads</span>
            </div>
            <div className={styles.kpiIconBox}>✉️</div>
          </div>

          <div className={styles.kpiCard}>
            <div className={styles.kpiContent}>
              <span className={styles.kpiLabel}>System Status</span>
              <span className={styles.kpiValue} style={{ fontSize: '24px', color: '#16A34A', marginTop: '6px' }}>
                OPTIMAL
              </span>
              <span className={styles.kpiMeta}>Flyway Schema v2</span>
            </div>
            <div className={styles.kpiIconBox}>⚡</div>
          </div>
        </div>

        {/* 3. TOOLBAR, TABS & FILTERS */}
        <div className={styles.toolbarCard}>
          <div className={styles.tabGroup}>
            <button
              onClick={() => setActiveTab('careers')}
              className={`${styles.tabItem} ${activeTab === 'careers' ? styles.activeTabItem : ''}`}
            >
              <span>Career Applications</span>
              <span className={styles.tabCounter}>{careers.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${styles.tabItem} ${activeTab === 'contacts' ? styles.activeTabItem : ''}`}
            >
              <span>Client Enquiries</span>
              <span className={styles.tabCounter}>{contacts.length}</span>
            </button>
          </div>

          <div className={styles.filterControls}>
            {activeTab === 'careers' && (
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className={styles.deptFilterSelect}
              >
                <option value="all">All Departments</option>
                <option value="software">Software Development</option>
                <option value="electronics">Electronics & Hardware</option>
                <option value="mechanical">Mechanical Engineering</option>
              </select>
            )}

            <div className={styles.searchContainer}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder={`Search ${activeTab === 'careers' ? 'applicants, roles...' : 'clients, messages...'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchField}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className={styles.clearSearchBtn}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. ENTERPRISE DATA TABLE */}
        <div className={styles.tableContainerCard}>
          <div className={styles.tableHeaderBar}>
            <h2 className={styles.tableHeading}>
              <span>{activeTab === 'careers' ? 'Applicant Talent Pipeline' : 'Inbound Customer Enquiries'}</span>
              <span className={styles.recordCountBadge}>
                ({activeTab === 'careers' ? filteredCareers.length : filteredContacts.length} records)
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className={styles.emptyNotice}>
              <div className={styles.emptyIconCircle}>↻</div>
              <div className={styles.emptyTitle}>Synchronizing PostgreSQL Repository...</div>
              <div className={styles.emptyDesc}>Retrieving latest submissions.</div>
            </div>
          ) : activeTab === 'careers' ? (
            /* ──────────────── CAREER APPLICATIONS TABLE ──────────────── */
            <div className={styles.tableScrollArea}>
              {filteredCareers.length === 0 ? (
                <div className={styles.emptyNotice}>
                  <div className={styles.emptyIconCircle}>💼</div>
                  <div className={styles.emptyTitle}>No Career Applications Found</div>
                  <div className={styles.emptyDesc}>
                    {searchTerm || deptFilter !== 'all' ? 'Try adjusting your filters or search query.' : 'Incoming job applications will appear here.'}
                  </div>
                </div>
              ) : (
                <table className={styles.enterpriseTable}>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Target Position</th>
                      <th>Department</th>
                      <th>Contact Details</th>
                      <th>Resume Archive</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCareers.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.avatarCircle}>{getInitials(app.name)}</div>
                            <div>
                              <div className={styles.avatarName}>{app.name}</div>
                              <div className={styles.recordId}>APP #{app.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: '#061D40' }}>
                            {app.roleTitle || app.roleId}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`${styles.chip} ${
                              app.department === 'software'
                                ? styles.chipBlue
                                : app.department === 'electronics'
                                ? styles.chipPurple
                                : app.department === 'mechanical'
                                ? styles.chipOrange
                                : styles.chipGrey
                            }`}
                          >
                            {app.department ? app.department.toUpperCase() : 'GENERAL'}
                          </span>
                        </td>
                        <td>
                          <div className={styles.contactLinks}>
                            <div className={styles.emailRow}>
                              <a href={`mailto:${app.email}`} className={styles.emailLink}>
                                {app.email}
                              </a>
                              <button
                                onClick={() => copyToClipboard(app.email, `career-${app.id}`)}
                                className={styles.copyBtn}
                                title="Copy email"
                              >
                                {copiedId === `career-${app.id}` ? '✓ Copied' : '📋'}
                              </button>
                            </div>
                            {app.phone && (
                              <div className={styles.phoneText}>
                                <span>📞</span>
                                <a href={`tel:${app.phone}`} style={{ color: 'inherit' }}>
                                  {app.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {app.resumeFilename ? (
                            <a
                              href={`${API_BASE_URL}/api/admin/careers/${app.id}/resume?key=${encodeURIComponent(adminKey)}`}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.resumeDownloadPill}
                              title="Download candidate resume"
                            >
                              <span>⬇</span>
                              <span>{app.resumeFilename}</span>
                              {app.resumeSize > 0 && (
                                <span style={{ opacity: 0.7, fontSize: '11px' }}>
                                  ({formatFileSize(app.resumeSize)})
                                </span>
                              )}
                            </a>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>None attached</span>
                          )}
                        </td>
                        <td>
                          <span className={styles.dateText}>{formatDate(app.createdAt)}</span>
                        </td>
                        <td>
                          <div className={styles.actionButtonGroup}>
                            <button
                              onClick={() => setSelectedDetail({ type: 'career', data: app })}
                              className={styles.viewDetailsBtn}
                            >
                              Review
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'career', item: app })}
                              className={styles.deleteActionBtn}
                              title="Delete application"
                            >
                              <span>🗑 Delete</span>
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
            /* ──────────────── CONTACT ENQUIRIES TABLE ──────────────── */
            <div className={styles.tableScrollArea}>
              {filteredContacts.length === 0 ? (
                <div className={styles.emptyNotice}>
                  <div className={styles.emptyIconCircle}>✉️</div>
                  <div className={styles.emptyTitle}>No Contact Enquiries Found</div>
                  <div className={styles.emptyDesc}>
                    {searchTerm ? 'No enquiries match your search query.' : 'Customer mission inquiries will appear here.'}
                  </div>
                </div>
              ) : (
                <table className={styles.enterpriseTable}>
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Organization</th>
                      <th>Contact Details</th>
                      <th>Message Snippet</th>
                      <th>Received Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.avatarCircle}>{getInitials(c.name)}</div>
                            <div>
                              <div className={styles.avatarName}>{c.name}</div>
                              <div className={styles.recordId}>INQ #{c.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {c.company ? (
                            <span className={`${styles.chip} ${styles.chipBlue}`}>{c.company}</span>
                          ) : (
                            <span className={`${styles.chip} ${styles.chipGrey}`}>Individual</span>
                          )}
                        </td>
                        <td>
                          <div className={styles.contactLinks}>
                            <div className={styles.emailRow}>
                              <a href={`mailto:${c.email}`} className={styles.emailLink}>
                                {c.email}
                              </a>
                              <button
                                onClick={() => copyToClipboard(c.email, `contact-${c.id}`)}
                                className={styles.copyBtn}
                                title="Copy email"
                              >
                                {copiedId === `contact-${c.id}` ? '✓ Copied' : '📋'}
                              </button>
                            </div>
                            {c.phone && (
                              <div className={styles.phoneText}>
                                <span>📞</span>
                                <a href={`tel:${c.phone}`} style={{ color: 'inherit' }}>
                                  {c.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={styles.messageSnippet} title={c.message}>
                            {c.message}
                          </div>
                        </td>
                        <td>
                          <span className={styles.dateText}>{formatDate(c.createdAt)}</span>
                        </td>
                        <td>
                          <div className={styles.actionButtonGroup}>
                            <button
                              onClick={() => setSelectedDetail({ type: 'contact', data: c })}
                              className={styles.viewDetailsBtn}
                            >
                              Review
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'contact', item: c })}
                              className={styles.deleteActionBtn}
                              title="Delete enquiry"
                            >
                              <span>🗑 Delete</span>
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
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MNC DELETE CONFIRMATION DIALOG (PROMINENT & SAFE)
      ───────────────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className={styles.modalBackdrop} onClick={() => !isDeleting && setDeleteTarget(null)}>
          <div className={styles.deleteConfirmCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.dangerIconBadge}>⚠️</div>

            <h3 className={styles.deleteModalTitle}>
              Delete {deleteTarget.type === 'career' ? 'Job Application' : 'Contact Enquiry'}?
            </h3>

            <p className={styles.deleteModalDesc}>
              This will permanently purge this record and all attached files from the Neon PostgreSQL database. This action cannot be reversed.
            </p>

            <div className={styles.targetEntityBox}>
              <div className={styles.targetEntityRow}>
                <span className={styles.targetKey}>Reference ID:</span>
                <span className={styles.targetVal}>#{deleteTarget.item.id}</span>
              </div>
              <div className={styles.targetEntityRow}>
                <span className={styles.targetKey}>Name:</span>
                <span className={styles.targetVal}>{deleteTarget.item.name}</span>
              </div>
              {deleteTarget.type === 'career' ? (
                <div className={styles.targetEntityRow}>
                  <span className={styles.targetKey}>Position:</span>
                  <span className={styles.targetVal}>
                    {deleteTarget.item.roleTitle || deleteTarget.item.roleId}
                  </span>
                </div>
              ) : (
                deleteTarget.item.company && (
                  <div className={styles.targetEntityRow}>
                    <span className={styles.targetKey}>Company:</span>
                    <span className={styles.targetVal}>{deleteTarget.item.company}</span>
                  </div>
                )
              )}
            </div>

            <div className={styles.deleteModalActions}>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className={styles.cancelModalBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className={styles.confirmDeleteBtn}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MNC SUBMISSION DETAIL MODAL / DRAWER
      ───────────────────────────────────────────────────────────── */}
      {selectedDetail && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedDetail(null)}>
          <div className={styles.detailModalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailHeader}>
              <h3 className={styles.detailHeaderTitle}>
                {selectedDetail.type === 'career' ? 'Candidate Application' : 'Customer Mission Enquiry'} #{selectedDetail.data.id}
              </h3>
              <button onClick={() => setSelectedDetail(null)} className={styles.modalCloseX}>
                ✕
              </button>
            </div>

            <div className={styles.detailGrid}>
              <div className={styles.detailFieldBox}>
                <div className={styles.detailFieldLabel}>Full Name</div>
                <div className={styles.detailFieldValue}>{selectedDetail.data.name}</div>
              </div>

              <div className={styles.detailFieldBox}>
                <div className={styles.detailFieldLabel}>Email Address</div>
                <div className={styles.detailFieldValue}>
                  <a href={`mailto:${selectedDetail.data.email}`} style={{ color: '#0757C8' }}>
                    {selectedDetail.data.email}
                  </a>
                </div>
              </div>

              {selectedDetail.data.phone && (
                <div className={styles.detailFieldBox}>
                  <div className={styles.detailFieldLabel}>Phone Number</div>
                  <div className={styles.detailFieldValue}>
                    <a href={`tel:${selectedDetail.data.phone}`} style={{ color: 'inherit' }}>
                      {selectedDetail.data.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedDetail.type === 'career' ? (
                <>
                  <div className={styles.detailFieldBox}>
                    <div className={styles.detailFieldLabel}>Applied Position</div>
                    <div className={styles.detailFieldValue}>
                      {selectedDetail.data.roleTitle || selectedDetail.data.roleId} (
                      {selectedDetail.data.department?.toUpperCase()})
                    </div>
                  </div>
                  <div className={styles.detailFieldBox}>
                    <div className={styles.detailFieldLabel}>Submitted Timestamp</div>
                    <div className={styles.detailFieldValue}>{formatDate(selectedDetail.data.createdAt)}</div>
                  </div>
                  <div className={styles.detailFieldBox}>
                    <div className={styles.detailFieldLabel}>Attached Resume</div>
                    <div className={styles.detailFieldValue}>
                      {selectedDetail.data.resumeFilename ? (
                        <a
                          href={`${API_BASE_URL}/api/admin/careers/${selectedDetail.data.id}/resume?key=${encodeURIComponent(adminKey)}`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.resumeDownloadPill}
                        >
                          ⬇ Download {selectedDetail.data.resumeFilename}
                        </a>
                      ) : (
                        'No resume attached'
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.detailFieldBox}>
                    <div className={styles.detailFieldLabel}>Company / Org</div>
                    <div className={styles.detailFieldValue}>
                      {selectedDetail.data.company || 'Individual Submitter'}
                    </div>
                  </div>
                  <div className={styles.detailFieldBox}>
                    <div className={styles.detailFieldLabel}>Received Timestamp</div>
                    <div className={styles.detailFieldValue}>{formatDate(selectedDetail.data.createdAt)}</div>
                  </div>
                </>
              )}
            </div>

            <div className={styles.detailMessageBox}>
              <div className={styles.detailFieldLabel}>
                {selectedDetail.type === 'career' ? 'Cover Letter / Statement' : 'Enquiry Message'}
              </div>
              <div className={styles.detailMessageContent}>{selectedDetail.data.message}</div>
            </div>

            <div className={styles.detailFooterActions}>
              <div className={styles.footerLeftGroup}>
                <a
                  href={`mailto:${selectedDetail.data.email}`}
                  className={styles.emailApplicantBtn}
                >
                  ✉ Reply via Email
                </a>

                {selectedDetail.type === 'career' && selectedDetail.data.resumeFilename && (
                  <a
                    href={`${API_BASE_URL}/api/admin/careers/${selectedDetail.data.id}/resume?key=${encodeURIComponent(adminKey)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.downloadBigBtn}
                  >
                    ⬇ Download Resume
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setDeleteTarget({ type: selectedDetail.type, item: selectedDetail.data });
                }}
                className={styles.deleteActionBtn}
                style={{ padding: '10px 16px' }}
              >
                <span>🗑 Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
