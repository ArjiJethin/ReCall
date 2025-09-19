import React from 'react';
import './styles/Home.css';
import Logo from '../assets/logo-nobg.png';
import Profile from '../assets/pfp.png';
import Uploads from '../assets/upload.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faFile, faCamera, faFolder, faChartBar, faPaperPlane, faFilePdf, faWebAwesome, faCertificate} from "@fortawesome/free-solid-svg-icons";
import DvdShadow from "./Animation.jsx";

import {
  FaHome,
  FaUserCircle,
  FaFileAlt,
  FaCamera,
  FaFolder,
  FaChartBar,
  FaChartLine,
  FaCalendarAlt,
  FaStar,
  FaBullseye,
  FaSearch,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa';

export default function HomePage() {
  const totalXP = 54;
  const requiredXP = 450;
  const progress = Math.min(1, totalXP / requiredXP);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const highlights = [
    { id: 1, title: 'Computer Networks', words: 100, date: '19 Sep' },
    { id: 2, title: 'Machine Learning', words: 100, date: '18 Sep' },
  ];

  const currentLevel = Math.max(1, Math.floor(totalXP / 100) + 1);
  const xpForNextLevel = currentLevel * 100;
  const xpNeeded = Math.max(0, xpForNextLevel - totalXP);
  const levelProgressPercent = Math.round(((totalXP - (currentLevel - 1) * 100) / (xpForNextLevel - (currentLevel - 1) * 100)) * 100);


  return (
    <div className="recall-app">
      <div className="page-inner">
        <main className="left-panel" aria-label="Main content">
          <header className="app-header">
            <div className="logo-head">
              <img src={Logo} alt="ReCall Logo" className="logo" />
              <h1 className="brand">ReCall</h1>
            </div>
            <button className="profile-btn" aria-label="Open profile">
              <FaUserCircle size={28} color='#2f6cff'/>
            </button>
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
              <div className="quick-number"><FontAwesomeIcon icon={faFile} size='lg'/></div>
              <div className="quick-meta">
                <div className="quick-title">Quizzes</div>
                <div className="quick-sub">1 Quiz</div>
              </div>
            </div>

            <div className="quick-card">
              <div className="quick-number"><FontAwesomeIcon icon={faFolder} size='lg'/></div>
              <div className="quick-meta">
                <div className="quick-title">Summaries</div>
                <div className="quick-sub">1 Card</div>
              </div>
            </div>
          </section>

          <section className="recent-highlights" aria-labelledby="highlightsTitle">
            <div className="section-title-row">
              <h3 id="highlightsTitle">Recent Highlights</h3>
              <button className="more-btn" aria-label="More options">All <FaChevronRight size={11} aria-hidden="true" color='#2f6cff'/></button>
            </div>

            <ul className="highlights-list">
              {highlights.map((h) => (
                <li className="highlight-item" key={h.id}>
                  <div className="highlight-icon" aria-hidden>
                    <FaFileAlt size={18} color='#2f6cff'/>
                  </div>
                  <div className="highlight-body">
                    <div className="highlight-title">{h.title}</div>
                    <div className="highlight-sub">{h.words} Words · {h.date}</div>
                  </div>
                  <button className="chev" aria-label={`Open ${h.title}`}>
                    <FaChevronRight size={18} aria-hidden="true" color='#2f6cff'/>
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
              <div className="badge-icon"><FaBullseye color="#2f6cff" aria-hidden="true" /></div>
              <div className="badge-body">
                <div className="badge-title">Motivated Learner</div>
                <div className="badge-sub">600/600 of Lemnot</div>
              </div>
              <hr />
              <div className="badge-icon"><FaBullseye color="#2f6cff" aria-hidden="true" /></div>
              <div className="badge-body">
                <div className="badge-title">Level {currentLevel}</div>
                <div className="badge-sub">{levelProgressPercent}% to Level {currentLevel + 1}</div>
              </div>
            </div>
          </div>
          <div className="desk-uploads">
            <img src={Uploads} alt="" className='desk-upload-image' />
            <div className="col">
              <h3 className="desk-title">Drag and drop your files here</h3>
              <div className="desk-upload">
            <button className="desk-btn" aria-label="Notes">
              <FontAwesomeIcon icon={faFile} size="2x" color="#2f6cff" className="desk-icon" />
              <span className="desk-label">Notes</span>
            </button>
          
            <button className="desk-btn" aria-label="Folders">
              <FontAwesomeIcon icon={faFilePdf} size="2x" color="#2f6cff" className="desk-icon" />
              <span className="desk-label">PDF</span>
            </button>
          
            <button className="desk-btn" aria-label="Stats">
              <FontAwesomeIcon icon={faPaperPlane} size="2x" color="#2f6cff" className="desk-icon" />
              <span className="desk-label">Text</span>
            </button>
          </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
