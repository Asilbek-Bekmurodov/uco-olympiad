import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { nextQuestion, prevQuestion } from "../../../app/features/test/testSlice";
import {
  useGetTestTimerQuery,
  useSubmitTestAnswersMutation,
  type SubmitTestResult,
} from "../../../app/services/testApi";
import styles from "./ExamPage.module.css";

const formatTime = (value: number) => value.toString().padStart(2, "0");

type Props = { onTestSubmit: (result: SubmitTestResult) => void };

const Footer = ({ onTestSubmit }: Props) => {
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.test.questions);
  const currentIndex = useAppSelector((s) => s.test.currentIndex);
  const answers = useAppSelector((s) => s.test.answers);
  const { testId } = useParams();
  const numericTestId = testId ? Number(testId) : NaN;
  const [submitAnswers, { isLoading: isSubmitting }] =
    useSubmitTestAnswersMutation();

  const [remaining, setRemaining] = useState<number | null>(null);

  const { data } = useGetTestTimerQuery(numericTestId, {
    skip: Number.isNaN(numericTestId),
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  useEffect(() => {
    if (data?.remainingSeconds === undefined) return;
    setRemaining(data.remainingSeconds);
  }, [data?.remainingSeconds]);

  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev === null ? null : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const minutes = remaining !== null ? Math.floor(remaining / 60) : 0;
  const seconds = remaining !== null ? remaining % 60 : 0;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === questions.length - 1;
  const allAnswered =
    questions.length > 0 &&
    questions.every((q) => {
      const ans = answers[q.id];
      return typeof ans === "number" && ans >= 0;
    });

  const handleFinish = async () => {
    if (Number.isNaN(numericTestId) || !allAnswered) return;
    const result = await submitAnswers({
      testId: numericTestId,
      body: answers,
    }).unwrap();
    onTestSubmit(result);
  };

  return (
    <div className={styles.footer}>
      <div className={styles.timerCircle}>
        {remaining === null ? "--:--" : `${formatTime(minutes)}:${formatTime(seconds)}`}
      </div>
      <div className={styles.footerActions}>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => dispatch(prevQuestion())}
          disabled={isFirst}
        >
          Orqaga
        </button>
        <button
          type="button"
          className={styles.navButton}
          onClick={() => dispatch(nextQuestion())}
          disabled={isLast}
        >
          Keyingi
        </button>
        <button
          type="button"
          className={`${styles.finishButton} ${
            allAnswered ? styles.finishButtonActive : styles.finishButtonDisabled
          }`}
          onClick={handleFinish}
          disabled={!allAnswered || isSubmitting}
        >
          {isSubmitting ? "Yuborilmoqda..." : "Practical examga o'tish"}
        </button>
      </div>
    </div>
  );
};

export default Footer;
