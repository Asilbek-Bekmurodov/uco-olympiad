import { useAppSelector } from "../../../app/hooks";
import Placeholder from "../../../assets/exam-placeholder.svg";
import styles from "./ExamPage.module.css";

const QuestionImage = () => {
  const questions = useAppSelector((s) => s.test.questions);
  const currentIndex = useAppSelector((s) => s.test.currentIndex);

  if (!questions.length) return null;

  const current = questions[currentIndex];
  const src = current?.imageUrl || Placeholder;

  return (
    <div className={styles.imageCard}>
      <img className={styles.image} src={src} alt="Question" />
    </div>
  );
};

export default QuestionImage;
