import { useLocation, useNavigate } from "react-router-dom";
import type { SubmitTestResult } from "../../app/services/testApi";
import styles from "./ResultScreen.module.css";
import Badge from "../../assets/result-badge.svg";
import { ConfettiSideCannons } from "../Confetti/Confetti";

const ResultScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as SubmitTestResult | null;

  if (!result) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.card}>
          <h2 className={styles.title}>Natija topilmadi</h2>
          <p className={styles.subtitle}>Iltimos, testni qayta topshiring.</p>
          <button
            className={styles.primaryButton}
            onClick={() => navigate("/home")}
          >
            Home
          </button>
        </div>
      </div>
    );
  }

  const scoreLine = `${result.totalScore} / ${result.maxPossibleScore}`;
  const correctLine = `${result.correctAnswers} / ${result.totalQuestions}`;
  const statusText = result.passed
    ? "Tabriklaymiz! Siz keyingi bosqichga o‘tdingiz."
    : "Afsuski, keyingi bosqichga o‘ta olmadingiz";

  return (
    <div className={styles.page}>
      <div className={styles.confettiLayer} />
      {result?.passed && (
        <div className={styles.confettiOverlay}>
          <ConfettiSideCannons auto showButton={false} />
        </div>
      )}
      <div className={styles.card}>
        <img className={styles.badge} src={Badge} alt="Result" />
        <h1 className={styles.title}>{statusText}</h1>
        <p className={styles.subtitle}>Natijangiz : {correctLine}</p>
        <div className={styles.metrics}>
          <div className={styles.metricItem}>
            <span className={styles.metricLabel}>Ball</span>
            <span className={styles.metricValue}>{scoreLine}</span>
          </div>
        </div>
        <button
          className={styles.primaryButton}
          onClick={() => navigate("/home")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
