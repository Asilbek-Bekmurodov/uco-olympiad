import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectOption } from "../../../app/features/test/testSlice";
import styles from "./ExamPage.module.css";

const Options = () => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.test.questions);
  const currentIndex = useAppSelector((s) => s.test.currentIndex);
  const answers = useAppSelector((s) => s.test.answers);

  if (!questions.length) return null;

  const current = questions[currentIndex];
  const selectedIndex = answers[current.id];

  return (
    <div className={styles.options}>
      {(current.options ?? []).map((opt, idx) => {
        const isSelected = selectedIndex === idx;
        const label = typeof opt === "string" ? opt : opt.text;
        return (
          <button
            key={`${current.id}-${idx}`}
            type="button"
            className={`${styles.option} ${
              isSelected ? styles.optionActive : ""
            }`}
            onClick={() =>
              dispatch(
                selectOption({ questionId: current.id, optionIndex: idx }),
              )
            }
          >
            <span className={styles.optionText}>{label}</span>
            <span className={styles.optionIndex}>{idx + 1}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Options;
