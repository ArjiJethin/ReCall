import React, { useEffect, useRef, useState } from "react";
import "./styles/ComputerNetworks.css";

// --- Data (unchanged) ---
const flashQAs = [
  { q: "What is a computer network?", a: "A set of interconnected computers sharing resources." },
  { q: "Example of person-to-person communication via networks?", a: "Email, instant messaging, social networks." },
  { q: "What law explains internet value increasing with users?", a: "Metcalfe’s Law." },
  { q: "Difference between PAN and LAN?", a: "PAN is short-range (Bluetooth), LAN is local (Ethernet/Wi-Fi)." },
  { q: "What was ARPANET?", a: "First packet-switching network by DoD, precursor to the Internet." },
];

const quizQuestions = [
  { q: "A computer network is:", options: ["A single computer system", "A set of interconnected computers sharing resources", "Only hardware connections", "None of the above"], correct: 1 },
  { q: "Bluetooth belongs to:", options: ["PAN", "LAN", "MAN", "WAN"], correct: 0 },
  { q: "The main technology behind ARPANET was:", options: ["Circuit switching", "Packet switching", "Optical switching", "Message queuing"], correct: 1 },
  { q: "OSI Model has how many layers?", options: ["3", "4", "5", "7"], correct: 3 },
];

export default function ComputerNetworks() {
  const flashRef = useRef(null);
  const quizRef = useRef(null);

  const [inlineOpen, setInlineOpen] = useState({ flash: false, quiz: false });
  const [overlay, setOverlay] = useState({ open: false, section: null, style: null, initialRect: null });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // progress tracking
  const [flashProgress, setFlashProgress] = useState(0);
  const [quizProgress, setQuizProgress] = useState(0);
  const [time, setTime] = useState(0);

  // simple timer effect
  useEffect(() => {
    const t = setInterval(() => setTime((sec) => sec + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // update progress when answers selected
  useEffect(() => {
    const completedFlash = currentIndex + 1;
    if (overlay.section === "flash") {
      setFlashProgress(Math.max(flashProgress, completedFlash));
    }
    if (overlay.section === "quiz") {
      const attempted = Object.keys(selectedAnswers).length;
      setQuizProgress(attempted);
    }
  }, [currentIndex, selectedAnswers, overlay.section]);

  // --- Overlay logic (same as before) ---
  function handleButtonClick(section) {
    setInlineOpen((s) => ({ ...s, [section]: true }));
    const ref = section === "flash" ? flashRef : quizRef;
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(ref.current);
    const borderRadius = computedStyle.borderRadius || "12px";

    setOverlay({
      open: true,
      section,
      style: { top: rect.top + "px", left: rect.left + "px", width: rect.width + "px", height: rect.height + "px", borderRadius },
      initialRect: rect,
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOverlay((o) => ({
          ...o,
          style: { top: 0, left: 0, width: "100vw", height: "100vh", borderRadius: "0px" },
        }));
        setCurrentIndex(0);
      });
    });
  }

  function handleCloseOverlay() {
    if (!overlay.initialRect) {
      setOverlay({ open: false, section: null, style: null, initialRect: null });
      return;
    }
    const rect = overlay.initialRect;
    setOverlay((o) => ({
      ...o,
      style: { top: rect.top + "px", left: rect.left + "px", width: rect.width + "px", height: rect.height + "px", borderRadius: "12px" },
    }));
    const onFinish = () => {
      setOverlay({ open: false, section: null, style: null, initialRect: null });
      setInlineOpen({ flash: false, quiz: false });
      window.removeEventListener("transitionend", onFinish);
    };
    window.addEventListener("transitionend", onFinish);
  }

  function renderOverlayContent() {
    if (!overlay.open || !overlay.section) return null;
    const isFlash = overlay.section === "flash";
    const items = isFlash ? flashQAs : quizQuestions;
    const len = items.length;

    return (
      <div className="overlay-inner">
        <header className="overlay-header">
          <h3>{isFlash ? "FlashCards" : "Quiz"}</h3>
          <div className="overlay-controls">
            <span>{currentIndex + 1} / {len}</span>
            <button className="icon-btn" onClick={handleCloseOverlay}>✕</button>
          </div>
        </header>

        <div className="overlay-slider-wrap">
          <div className="overlay-slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {items.map((it, idx) => (
              <article className="overlay-card" key={idx}>
                <div className="overlay-card-inner">
                  <h4>{it.q}</h4>
                  {isFlash ? (
                    <details><summary>Show Answer</summary><div>{it.a}</div></details>
                  ) : (
                    <div className="quiz-options">
                      {it.options.map((opt, oi) => (
                        <button
                          key={oi}
                          className={`option-btn ${selectedAnswers[idx] === oi ? "chosen" : ""}`}
                          onClick={() => {
                            if (typeof selectedAnswers[idx] === "undefined") setSelectedAnswers((s) => ({ ...s, [idx]: oi }));
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                      {typeof selectedAnswers[idx] !== "undefined" && (
                        <div className="quiz-result">
                          {selectedAnswers[idx] === it.correct ? "✅ Correct" : `❌ Wrong — Correct: ${it.options[it.correct]}`}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        <footer className="overlay-footer">
          <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>← Prev</button>
          <button onClick={() => setCurrentIndex((i) => Math.min(i + 1, len - 1))} disabled={currentIndex === len - 1}>Next →</button>
        </footer>
      </div>
    );
  }

  // helper for time display
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="cn-page">
      <header className="cn-header">
        <h1 className="cn-title">Computer Networks</h1>
        <p className="cn-subtitle">Choose a tool to start learning smarter </p>
      </header>

      <div className="cn-cards">
        {/* FlashCards */}
        <div ref={flashRef} className="cn-card blue-cards">
          <h2>FlashCards</h2>
          <p className="cn-card-desc">Flashcards help you revise faster, test yourself repeatedly, and strengthen recall. Instead of rereading long notes, you’ll have bite-sized study prompts designed to improve memory retention and make revision more efficient. Whether it’s protocols, OSI layers, or network algorithms, flashcards help you revise faster, test yourself repeatedly, and strengthen long-term recall. Transform your study materials into interactive, easy-to-digest flashcards. Simply upload your PDF, and the system will automatically extract key concepts, definitions, and important points, converting them into concise flashcards.</p>
          {inlineOpen.flash && <div className="cn-card-extra"><p>Sample Q&A...</p></div>}
          <button className="cn-btn" onClick={() => handleButtonClick("flash")}>Open FlashCards</button>
        </div>

        {/* Quiz */}
        <div ref={quizRef} className="cn-card green-card">
          <h2>Quiz</h2>
          <p className="cn-card-desc">Challenge yourself with auto-generated quizzes based on your notes. Turn your learning into a challenge with automatically generated quizzes from your uploaded PDFs. The system scans your notes and creates thoughtful multiple-choice and short-answer questions based on the key concepts and details inside. Instead of just reading, you’ll be actively testing your knowledge—pinpointing what you’ve mastered and what needs more revision. Whether it’s identifying network topologies, recalling TCP/IP layers, or understanding algorithms, quizzes ensure you’re exam-ready and confident.</p>
          {inlineOpen.quiz && <div className="cn-card-extra"><p>Sample quiz items...</p></div>}
          <button className="cn-btn" onClick={() => handleButtonClick("quiz")}>Start Quiz</button>
        </div>
        {/* Summary */}
        <div className="cn-card gold-card wide">
          <h2>Summary</h2>
          <p><h3>1. Introduction</h3> <p>A computer network = interconnected computers sharing resources (e.g., internet, files, printers).</p> <p>Networking includes hardware, protocols, software, wired & wireless tech.</p> <h3>2. Uses of Computer Networks</h3> <ul> <li>Access to Information – internet, news, journals, client-server model, P2P.</li> <li>Person-to-Person Communication – email, IM, social media, wikis.</li> <li>E-commerce – online shopping, banking, auctions.</li> <li>Entertainment – streaming, games, interactive TV.</li> <li>Internet of Things (IoT) – smart homes, sensors, smart meters, ubiquitous computing.</li> </ul> <h3>3. Types of Networks</h3> <ul> <li>Broadband Access Networks – home internet, Metcalfe’s law.</li> <li>Mobile & Wireless Networks – smartphones, Wi-Fi, m-commerce.</li> <li>Content Provider Networks – data centers, CDNs (Google, Akamai).</li> <li>Transit Networks – connect ISPs/content providers.</li> <li>Enterprise Networks – internal business networks, remote access.</li> </ul></p>
        </div>

        {/* Progress Card */}
        <div className="cn-card progress-card">
          <h2> Progress</h2>
          <p>FlashCards: {flashProgress}/{flashQAs.length}</p>
          <div className="progress-bar"><div style={{ width: `${(flashProgress / flashQAs.length) * 100}%` }} /></div>
          <p>Quiz Attempted: {quizProgress}/{quizQuestions.length}</p>
          <div className="progress-bar"><div style={{ width: `${(quizProgress / quizQuestions.length) * 100}%` }} /></div>
          <p>Time: {formatTime(time)}</p>
        </div>
      </div>

      {overlay.open && (
        <div className="expanding-overlay" onMouseDown={(e) => e.target.classList.contains("expanding-overlay") && handleCloseOverlay()}>
          <div className="expanding-card" style={overlay.style}>{renderOverlayContent()}</div>
        </div>
      )}
    </div>
  );
}
