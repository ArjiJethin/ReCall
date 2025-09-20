import React, { useEffect, useRef, useState } from "react";
import "./styles/ComputerNetworks.css";

// --- Data (flashcards & quiz) ---
const flashQAs = [
  { q: "What is Machine Learning?", a: "Programming computers to optimize performance using past data/experience." },
  { q: "Example of supervised learning task?", a: "Classification (credit scoring), Regression (car price prediction)." },
  { q: "What is association learning?", a: "Finding relationships in data (e.g., P(chips | beer) = 0.7)." },
  { q: "Key applications of ML?", a: "Face recognition, medical diagnosis, fraud detection, recommendation systems." },
  { q: "Bayes’ theorem formula?", a: "Posterior = (Likelihood × Prior) / Evidence." },
  { q: "What is Gaussian distribution?", a: "Bell-shaped, symmetric, mean=median, basis of many ML models." },
  { q: "What are the 3 components of ML systems?", a: "Data, Models, Learning." },
  { q: "What is overfitting?", a: "When a model fits training data too well but fails on unseen data." },
  { q: "What is reinforcement learning?", a: "Learning through rewards and penalties (trial & error)." },
  { q: "Example of latent variable model?", a: "PCA, Hidden Markov Models, LDA for topic modeling." },
];

const quizQuestions = [
  { q: "ML is mainly about:", options: ["Writing fixed programs", "Optimizing performance from past data", "Manual rule creation", "None of the above"], correct: 1 },
  { q: "Which is NOT a type of ML?", options: ["Supervised", "Unsupervised", "Reinforcement", "Compilation"], correct: 3 },
  { q: "Classification belongs to:", options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Association"], correct: 0 },
  { q: "Predicting car prices is an example of:", options: ["Classification", "Regression", "Reinforcement Learning", "Association"], correct: 1 },
  { q: "Basket analysis is related to:", options: ["Association", "Regression", "Supervised Learning", "Reinforcement"], correct: 0 },
  { q: "Bayes’ Theorem is used to:", options: ["Predict future weather only", "Update probability based on new evidence", "Generate datasets", "Train deep networks"], correct: 1 },
  { q: "Gaussian distribution has:", options: ["Skewed curve", "Bell-shaped curve", "Flat curve", "None of the above"], correct: 1 },
  { q: "Overfitting means:", options: ["High training accuracy but poor test accuracy", "Model works perfectly on all data", "Low training accuracy", "None"], correct: 0 },
  { q: "In reinforcement learning, learning is guided by:", options: ["Labels", "Rewards and penalties", "Clustering", "Probabilities only"], correct: 1 },
  { q: "Which is a latent variable model?", options: ["PCA", "Linear regression", "Logistic regression", "KNN"], correct: 0 },
];

export default function MachineLearning() {
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

  // simple timer
  useEffect(() => {
    const t = setInterval(() => setTime((sec) => sec + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // update progress
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

  // overlay logic
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

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="cn-page">
      <header className="cn-header">
        <h1 className="cn-title">Machine Learning</h1>
        <p className="cn-subtitle">Choose a tool to start learning smarter</p>
      </header>

      <div className="cn-cards">
        {/* FlashCards */}
        <div ref={flashRef} className="cn-card blue-cards">
          <h2>FlashCards</h2>
          <p className="cn-card-desc">Flashcards simplify complex ML concepts into bite-sized Q&As, making it easier to revise definitions, formulas, and types of learning. Instead of re-reading long notes, you’ll actively recall key concepts like supervised vs unsupervised learning, Bayes’ theorem, Gaussian distribution, and applications of ML. Upload your notes or PDFs, and they’ll automatically transform into interactive flashcards to strengthen your memory and speed up revision.</p>
          {inlineOpen.flash && <div className="cn-card-extra"><p>Sample Q&A...</p></div>}
          <button className="cn-btn" onClick={() => handleButtonClick("flash")}>Open FlashCards</button>
        </div>

        {/* Quiz */}
        <div ref={quizRef} className="cn-card green-card">
          <h2>Quiz</h2>
          <p className="cn-card-desc">Challenge yourself with interactive quizzes generated from your ML notes. Instead of passively reading, test your understanding of algorithms, probability, and applications. The quiz system automatically creates multiple-choice questions covering supervised, unsupervised, reinforcement learning, and math foundations like Bayes’ theorem and Gaussian distribution. This way you’ll know exactly where you’re strong and where to improve.</p>
          {inlineOpen.quiz && <div className="cn-card-extra"><p>Sample quiz items...</p></div>}
          <button className="cn-btn" onClick={() => handleButtonClick("quiz")}>Start Quiz</button>
        </div>

        {/* Summary */}
        <div className="cn-card gold-card wide">
          <h2>Summary</h2>
          <p>
            <h3>1. Introduction to ML</h3>
            ML = programming computers to optimize performance using past data/experience. Useful when expertise is missing, can’t be explained, changes over time, or must adapt (e.g., biometrics).
            <h3>2. Types of ML</h3>
            Association (basket analysis), Supervised (classification, regression), Unsupervised (clustering), Reinforcement (trial & error).
            <h3>3. Applications</h3>
            Pattern recognition, NLP, recommendation systems, fraud detection, medical diagnosis.
            <h3>4. Math for ML</h3>
            Bayes’ Theorem, Gaussian distribution, ERM, overfitting, MLE, MAP, LVMs (PCA, HMMs, LDA).
          </p>
        </div>

        {/* Progress Card */}
        <div className="cn-card progress-card">
          <h2>Progress</h2>
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
