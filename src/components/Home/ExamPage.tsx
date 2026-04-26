import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetTestQuestionsQuery,
  type SubmitTestResult,
} from "../../app/services/testApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setQuestions, resetTest } from "../../app/features/test/testSlice";
import { useExamGuard } from "../../hooks/useExamGuard";
import Pagination from "./ExamPage/Pagination";
import Title from "./ExamPage/Title";
import QuestionImage from "./ExamPage/QuestionImage";
import Options from "./ExamPage/Options";
import Footer from "./ExamPage/Footer";
import PracticalExam from "./PracticalExam";
import styles from "./ExamPage/ExamPage.module.css";
import guardStyles from "./ExamGuard.module.css";

const ExamPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const numericTestId = testId ? Number(testId) : NaN;
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.test.questions);
  const { examId } = useAppSelector((s) => s.test.session);
  const [testResult, setTestResult] = useState<SubmitTestResult | null>(null);
  const [violated, setViolated] = useState(false);

  useExamGuard({
    onViolation: () => setViolated(true),
  });

  const { data, isFetching } = useGetTestQuestionsQuery(numericTestId, {
    skip: Number.isNaN(numericTestId),
  });

  useEffect(() => {
    if (data) dispatch(setQuestions(data));
  }, [data, dispatch]);

  const handleLeave = () => {
    dispatch(resetTest());
    navigate("/home");
  };

  if (violated) {
    return (
      <div className={guardStyles.overlay}>
        <div className={guardStyles.modal}>
          <div className={guardStyles.iconWrap}>⚠️</div>
          <h2 className={guardStyles.title}>Imtihon yakunlandi</h2>
          <p className={guardStyles.desc}>
            Siz imtihon vaqtida boshqa oynaga o'tdingiz yoki taqiqlangan
            amallardan foydalandingiz. Natijangiz bekor qilindi.
          </p>
          <button className={guardStyles.btn} onClick={handleLeave}>
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (testResult && examId !== null) {
    return <PracticalExam testId={examId} testResult={testResult} />;
  }

  if (isFetching && !questions.length) {
    return <div className={styles.loading}>Yuklanmoqda...</div>;
  }

  return (
    <div className={styles.page}>
      <Pagination />
      <Title />
      <div className={styles.content}>
        <QuestionImage />
        <Options />
      </div>
      <Footer onTestSubmit={setTestResult} />
    </div>
  );
};

export default ExamPage;
