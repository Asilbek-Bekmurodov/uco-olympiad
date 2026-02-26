import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCurrentIndex } from "../../../app/features/test/testSlice";
import styles from "./ExamPage.module.css";

const Pagination = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.test.questions);
  const currentIndex = useAppSelector((s) => s.test.currentIndex);
  const answers = useAppSelector((s) => s.test.answers);

  if (!questions.length) return null;

  return (
    <div className={styles.pagination}>
      {questions.map((q, idx) => {
        const isActive = idx === currentIndex;
        const isAnswered = (answers[q.id] ?? -1) >= 0;
        return (
          <button
            key={q.id}
            type="button"
            onClick={() => dispatch(setCurrentIndex(idx))}
            className={`${styles.pageDot} ${
              isActive ? styles.pageActive : ""
            } ${isAnswered ? styles.pageAnswered : ""}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
