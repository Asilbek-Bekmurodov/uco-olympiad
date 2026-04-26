import { useNavigate } from "react-router-dom";
import { FaTelegramPlane } from "react-icons/fa";
import { MdOutlineAccessTime } from "react-icons/md";
import styles from "./ResultScreen.module.css";

const ResultScreen = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <MdOutlineAccessTime className={styles.icon} />
        </div>

        <h1 className={styles.title}>Imtihon yakunlandi!</h1>
        <p className={styles.subtitle}>
          Javoblar tez orada e'lon qilinadi
        </p>
        <p className={styles.hint}>
          Natijalar haqida xabardor bo'lish uchun Telegram kanalimizga
          obuna bo'ling.
        </p>

        <div className={styles.actions}>
          <a
            className={styles.telegramButton}
            href="https://t.me/uco_olympiad"
            target="_blank"
            rel="noreferrer"
          >
            <FaTelegramPlane />
            Telegram kanal
          </a>
          <button
            className={styles.homeButton}
            onClick={() => navigate("/home")}
          >
            Bosh sahifaga
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
