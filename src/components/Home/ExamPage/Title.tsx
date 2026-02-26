import { useAppSelector } from "../../../app/hooks";
import styles from "./ExamPage.module.css";

const Title = () => {
  const questions = useAppSelector((s) => s.test.questions);
  const currentIndex = useAppSelector((s) => s.test.currentIndex);

  if (!questions.length) return null;

  const current = questions[currentIndex];

  return (
    <div className={styles.titleWrap}>
      <div className={styles.titleTop}>Savol {currentIndex + 1}</div>
      <h2 className={styles.titleText}>{current?.text ?? ""}</h2>
    </div>
  );
};

export default Title;
