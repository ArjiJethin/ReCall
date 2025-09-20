import React, { useEffect, useRef, useState } from 'react';
import './styles/Home.css';
import Logo from '../assets/logo-nobg.png';
import Uploads from '../assets/upload.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFile, faCamera, faFolder, faChartBar, faPaperPlane, faCircleCheck, faCircleDown, faFileArrowUp, faInfoCircle, faBolt, faFilePdf, faWebAwesome, faCertificate, faWandMagicSparkles, faCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaFileAlt,
  FaChartLine,
  FaCalendarAlt,
  FaStar,
  FaSearch,
  FaChevronRight
} from 'react-icons/fa';

export default function HomePage() {
  const navigate = useNavigate();

  const totalXP = 54;
  const requiredXP = 46;
  const progress = Math.min(1, totalXP / requiredXP);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const highlights = [
    { id: 1, title: 'Computer Networks', words: 4363, date: '19 Sep' },
    { id: 2, title: 'Machine Learning', words: 2345, date: '18 Sep' },
  ];

  const currentLevel = Math.max(1, Math.floor(totalXP / 100) + 1);
  const xpForNextLevel = currentLevel * 100;
  const xpNeeded = Math.max(0, xpForNextLevel - totalXP);
  const levelProgressPercent = Math.round(((totalXP - (currentLevel - 1) * 100) / (xpForNextLevel - (currentLevel - 1) * 100)) * 100);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileBtnRef = useRef(null);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [showAbout, setShowAbout] = useState(false);

  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const canInstall = !!deferredPrompt && !isInstalled;

  useEffect(() => {
    function beforeInstallHandler(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }

    function appInstalledHandler() {
      setIsInstalled(true);
      setDeferredPrompt(null);
      showToastMessage('App installed successfully!');
    }

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    try {
      const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
      const isNavigatorStandalone = window.navigator.standalone; // iOS
      if (isStandalone || isNavigatorStandalone) {
        setIsInstalled(true);
      }
    } catch (err) { /* ignore */ }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen) {
        const menu = menuRef.current;
        const btn = profileBtnRef.current;
        if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
          setMenuOpen(false);
        }
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setShowAbout(false);
      }
    }
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  function showToastMessage(msg, ms = 3500) {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), ms);
  }

  async function handleInstallClick() {
    if (!deferredPrompt) {
      showToastMessage('Install not available on this device/browser.');
      setMenuOpen(false);
      return;
    }
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice && choice.outcome === 'accepted') {
        setIsInstalled(true);
        showToastMessage('Thanks — app installed!');
      } else {
        showToastMessage('Installation dismissed.');
      }
    } catch (err) {
      showToastMessage('Install failed.');
    } finally {
      setDeferredPrompt(null);
      setMenuOpen(false);
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
    setMenuOpen(false);
  }

  // ---------- UPDATED: single file-change handler with CN-MOD1 and ML-MOD1 checks ----------
  function handleFilesSelected(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...files]);
    showToastMessage(`${files.length} file(s) uploaded`);

    // If any uploaded file matches CN-MOD1 (case-insensitive), navigate to /ComputerNetworks
    // Also check for ML-MOD1 and navigate to /MachineLearning.
    files.forEach((file) => {
      const name = (file.name || '').toLowerCase();

      // preserve original CN behavior
      if (name.includes('cn-mod1')) {
        navigate('/ComputerNetworks');
      }

      // new: ML check (case-insensitive). If filename contains 'ml-mod1' (e.g. ML-MOD1.pdf), go to MachineLearning
      if (name.includes('ml-mod1')) {
        navigate('/MachineLearning');
      }

      // If you want to stop after first match, you can add a guard to break out of the loop.
    });

    // reset input so same file can be selected again later
    e.target.value = null;
  }

  // ---------- UPDATED: drag & drop handler with CN-MOD1 and ML-MOD1 checks ----------
  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dt = e.dataTransfer;
    if (!dt) return;
    const files = dt.files ? Array.from(dt.files) : [];
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files]);
      showToastMessage(`${files.length} file(s) uploaded via drag & drop`);

      files.forEach((file) => {
        const name = (file.name || '').toLowerCase();

        // preserve original CN behavior
        if (name.includes('cn-mod1')) {
          navigate('/ComputerNetworks');
        }

        // new: ML check (case-insensitive)
        if (name.includes('ml-mod1')) {
          navigate('/MachineLearning');
        }
      });
    }
  }

  function openAbout() {
    setShowAbout(true);
    setMenuOpen(false);
  }
  function closeAbout() {
    setShowAbout(false);
  }

  return (
    <div className="recall-app">
      <div className="page-inner">
        <main className="left-panel" aria-label="Main content">
          <header className="app-header">
            <div className="logo-head">
              <img src={Logo} alt="ReCall Logo" className="logo" />
              <h1 className="brand">ReCall</h1>
            </div>

            <div className="profile-wrap" style={{ position: 'relative' }}>
              <button
                ref={profileBtnRef}
                className="profile-btn"
                aria-label="Open profile"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
              >
                <FaUserCircle size={28} color="#2f6cff" />
              </button>

              {menuOpen && (
                <ul
                  ref={menuRef}
                  className="profile-dropdown"
                  role="menu"
                  aria-label="Profile menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    minWidth: 180,
                    borderRadius: 12,
                    padding: '8px',
                    zIndex: 60,
                  }}
                >
                  {canInstall && (
                    <li
                      role="menuitem"
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstallClick();
                      }}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '8px' }}
                    >
                      <span style={{ width: 28, textAlign: 'center' }}><FontAwesomeIcon icon={faCircleDown} /></span>
                      <span>Download App</span>
                    </li>
                  )}

                  {!canInstall && !isInstalled && (
                    <li
                      role="menuitem"
                      className="dropdown-item"
                      style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: 8, padding: '8px', color: '#888' }}
                      title="Install prompt not available"
                    >
                      <span style={{ width: 28, textAlign: 'center' }}><FontAwesomeIcon icon={faCircleDown} /></span>
                      <span>Download not available</span>
                    </li>
                  )}

                  {isInstalled && (
                    <li
                      role="menuitem"
                      className="dropdown-item"
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', color: '#444' }}
                      title="App already installed"
                    >
                      <span style={{ width: 28, textAlign: 'center' }}><FontAwesomeIcon icon={faCircleCheck}  color='green'/></span>
                      <span>App installed</span>
                    </li>
                  )}

                  <li
                    role="menuitem"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadClick();
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '8px' }}
                  >
                    <span style={{ width: 28, textAlign: 'center' }}><FontAwesomeIcon icon={faFileArrowUp} /></span>
                    <span>Upload</span>
                  </li>

                  <li
                    role="menuitem"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      openAbout();
                    }}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: '8px' }}
                  >
                    <span style={{ width: 28, textAlign: 'center' }}><FontAwesomeIcon icon={faInfoCircle} /></span>
                    <span>About</span>
                  </li>
                </ul>
              )}
            </div>
          </header>

          <div className="search-wrap">
            <input
              type="search"
              className="search-input"
              placeholder="Search notes..."
              aria-label="Search notes"
            />
            <button className="search-btn" aria-label="Search">
              <FaSearch size={18} aria-hidden="true" color='#2f6cff' />
            </button>
          </div>

          <section className="streak-card" aria-labelledby="streakTitle">
            <div className="streak-left">
              <div className="streak-icon" aria-hidden>
                <FontAwesomeIcon icon={faWebAwesome} />
              </div>
              <div className="streak-body">
                <h2 id="streakTitle" className="streak-title">Streak Count</h2>
                <div className="streak-sub">Total XP <strong>{totalXP}</strong></div>
                <div className="progress">
                  <div className="progress-track" />
                </div>
              </div>
            </div>
            <div className="streak-right">
              <div className="level-info">
                <h3 className="level-title">Level</h3>
                <p className="level-value"><strong>{currentLevel}</strong> (current)</p>
              </div><br />
              <div className="xp-info">
                <h3 className="xp-title">Required XP</h3>
                <p className="xp-value">{xpForNextLevel - totalXP} XP</p>
              </div>
            </div>
          </section>

          <section className="quick-cards">
            <div className="quick-card">
              <div className="quick-number"><FontAwesomeIcon icon={faFile} size='lg' /></div>
              <div className="quick-meta">
                <div className="quick-title">Quizzes</div>
                <div className="quick-sub">2 Quizzes</div>
              </div>
            </div>

            <div className="quick-card">
              <div className="quick-number"><FontAwesomeIcon icon={faFolder} size='lg' /></div>
              <div className="quick-meta">
                <div className="quick-title">FlashCards</div>
                <div className="quick-sub">2 Cards</div>
              </div>
            </div>
          </section>

          <section className="recent-highlights" aria-labelledby="highlightsTitle">
            <div className="section-title-row">
              <h3 id="highlightsTitle">Recent Highlights</h3>
              <button className="more-btn" aria-label="More options">All <FaChevronRight size={11} aria-hidden="true" color='#2f6cff' /></button>
            </div>

            <ul className="highlights-list">
              {highlights.map((h) => (
                <li className="highlight-item" key={h.id}>
                  <div className="highlight-icon" aria-hidden>
                    <FaFileAlt size={18} color='#2f6cff' />
                  </div>
                  <div className="highlight-body">
                    <div className="highlight-title">{h.title}</div>
                    <div className="highlight-sub">{h.words} Words · {h.date}</div>
                  </div>
                  <button className="chev" aria-label={`Open ${h.title}`}>
                    <FaChevronRight size={18} aria-hidden="true" color='#2f6cff' />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <nav className="bottom-nav" aria-label="Primary navigation">
            <button className="nav-btn" aria-label="Home">
              <FontAwesomeIcon icon={faHouse} size='2x' color="#2f6cff" className='navicon' />
              <span className="nav-label">Home</span>
            </button>

            <button className="nav-btn" aria-label="Notes">
              <FontAwesomeIcon icon={faFile} size='2x' color="#2f6cff" className='navicon' />
              <span className="nav-label">Notes</span>
            </button>

            <button className="nav-btn cam" aria-label="Camera">
              <FontAwesomeIcon icon={faCamera} size='2x' color="#fff" className='navicon main' />
              <span className='white-text'>Scan</span>
            </button>

            <button className="nav-btn" aria-label="Folders">
              <FontAwesomeIcon icon={faFolder} size='2x' color="#2f6cff" className='navicon' />
              <span className="nav-label">Folders</span>
            </button>

            <button className="nav-btn" aria-label="Stats">
              <FontAwesomeIcon icon={faChartBar} size='2x' color="#2f6cff" className='navicon' />
              <span className="nav-label">Stats</span>
            </button>
          </nav>
        </main>

        <aside className="right-panel" aria-label="Gamification and stats">
          <div className="stats-sec">
            <ul className="xp-list">
              <li><FontAwesomeIcon className='xp-icon' icon={faCertificate} /> +5 XP for maintaining daily streak</li>
              <li><FontAwesomeIcon className='xp-icon' icon={faCertificate} /> +10 XP for each completed quiz</li>
              <li><FontAwesomeIcon className='xp-icon' icon={faCertificate} /> +8 XP for reviewing notes</li>
              <li><FontAwesomeIcon className='xp-icon' icon={faCertificate} /> +20 XP for leveling up, earning badges</li>
            </ul>
            <div className="donut-wrap" role="img" aria-label={`Progress ${Math.round(progress * 100)}%`}>
              <svg width="180" height="180" viewBox="0 0 180 180" className="donut">
                <defs>
                  <linearGradient id="grad" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#ffffffff" />
                    <stop offset="100%" stopColor="#2f6cff" />
                  </linearGradient>
                </defs>

                <circle cx="90" cy="90" r={radius} className="donut-bg" strokeWidth="18" fill="none" />

                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  className="donut-progress"
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 90 90)"
                />

                <g className="donut-center" transform="translate(0,0)">
                  <foreignObject x="70" y="55" width="40" height="40">
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <FaStar color="#2f6cff" size={27} />
                    </div>
                  </foreignObject>
                  <text x="90" y="111" textAnchor="middle" fontSize="22" fontWeight="700">{requiredXP} XP</text>
                  <text x="90" y="126" textAnchor="middle" fontSize="12" fill="#666">Required</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="badges-grid">
            <div className="badge-card green-card">
              <div className="badge-icon green-icon"><FaChartLine color="#5cc578ff" aria-hidden="true" /></div>
              <div className="badge-body">
                <div className="badge-title">TOP 5%</div>
                <div className="badge-sub">Best Quiz Streak</div>
              </div>
            </div>

            <div className="badge-card blue-card">
              <div className="badge-icon blue-icon"><FaCalendarAlt color="#2f6cff" aria-hidden="true" /></div>
              <div className="badge-body">
                <div className="badge-title">Streak</div>
                <div className="badge-sub">For daily activity</div>
              </div>
            </div>

            <div className="badge-card gold-card">
              <div className="badge-icon gold-icon"><FaStar color="gold" aria-hidden="true" /></div>
              <div className="badge-body">
                <div className="badge-title">Gold Badges</div>
                <div className="badge-sub">Folder Collection</div>
              </div>
            </div>

            <div className="badge-card wide">
              <div className="badge-icon"><FontAwesomeIcon icon={faWandMagicSparkles} color="#2f6cff" /></div>
              <div className="badge-body">
                <div className="badge-title">Motivated Learner</div>
                <div className="badge-sub">600/600 of Lemnot</div>
              </div>
              <hr />
              <div className="badge-icon"><FontAwesomeIcon icon={faBolt} color="#2f6cff" aria-hidden="true" /></div>
              <div className="badge-body">
                <div className="badge-title">Level {currentLevel}</div>
                <div className="badge-sub">{levelProgressPercent}% to Level {currentLevel + 1}</div>
              </div>
            </div>
          </div>

          <div
            className={`desk-uploads ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            aria-label="Drag and drop files here"
            role="region"
          >
            <img src={Uploads} alt="" className='desk-upload-image' />
            <div className="col">
             <div className="desk-up">
                {uploadedFiles.length === 0 ? (
                  <>
                  <h3 className="desk-title">Drag and drop your files here</h3>
                  <div className="desk-upload">
                    <button
                      className="desk-btn"
                      aria-label="Notes"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FontAwesomeIcon icon={faFile} size="2x" color='#3f72eaff' className="desk-icon" />
                      <span className="desk-label">Notes</span>
                    </button>

                    <button
                      className="desk-btn"
                      aria-label="PDF"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FontAwesomeIcon icon={faFilePdf} size="2x" color='#3f72eaff' className="desk-icon" />
                      <span className="desk-label">PDF</span>
                    </button>

                    <button
                      className="desk-btn"
                      aria-label="Text"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} size="2x" color='#3f72eaff' className="desk-icon" />
                      <span className="desk-label">Text</span>
                    </button>
                  </div>
                  </>
                ) : (
                  <div className="uploaded-list" style={{ marginTop: 12 }}>
                    <strong>Uploaded:</strong>
                    <ul style={{ marginTop: 8 }}>
                      {uploadedFiles.map((f, i) => (
                        <li key={`${f.name}-${i}`} style={{ fontSize: 13 }}>
                          {f.name}{" "}
                          <span style={{ color: "#666", marginLeft: 8 }}>
                            ({Math.round(f.size / 1024)} KB)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFilesSelected}
            />
          </div>
        </aside>
      </div>

      {showAbout && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="aboutTitle"
          className="modal-overlay"
          onClick={closeAbout}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '0.3px solid rgba(19, 90, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 80,
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '0.3px solid rgba(19, 90, 255, 0.15)',
              padding: 20,
              borderRadius: 12,
              width: 'min(720px, 94%)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 id="aboutTitle">About ReCall</h2>
              <button aria-label="Close about" onClick={closeAbout} style={{ background: 'transparent', border: 'none', fontSize: 20 }}>✕</button>
            </header>
            <div style={{ marginTop: 12 }}>
              <p><strong>ReCall</strong> — a focused study & streak app to help you retain knowledge. This app supports offline usage and installation as a Progressive Web App (PWA) where supported. Use the profile menu to install the app (if available) or upload files to your account.</p>
              <p style={{ marginTop: 8 }}>Version: <strong>1.0.0</strong></p>
              <p style={{ marginTop: 8 }}>If the Install option is not visible, your browser may not support the install prompt or you might already have the app added to your device.</p>
            </div>
            <footer style={{ marginTop: 16, textAlign: 'right' }}>
              <button onClick={closeAbout} className="btn" style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '0.3px solid rgba(19, 90, 255, 0.15)'}}>Close</button>
            </footer>
          </div>
        </div>
      )}

      {toast && (
        <div
          className="toast"
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff16',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '0.3px solid rgba(19, 90, 255, 0.15)',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: 10,
            zIndex: 90,
            boxShadow: '0 6px 18px rgba(0,0,0,0.16)',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
