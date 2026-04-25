import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTestQuestionsQuery, type SubmitTestResult } from "../../app/services/testApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setQuestions } from "../../app/features/test/testSlice";
import Pagination from "./ExamPage/Pagination";
import Title from "./ExamPage/Title";
import QuestionImage from "./ExamPage/QuestionImage";
import Options from "./ExamPage/Options";
import Footer from "./ExamPage/Footer";
import PracticalExam from "./PracticalExam";
import styles from "./ExamPage/ExamPage.module.css";

const ExamPage = () => {
  const { testId } = useParams();
  const numericTestId = testId ? Number(testId) : NaN;
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.test.questions);
  const [testResult, setTestResult] = useState<SubmitTestResult | null>(null);

  const { data, isFetching } = useGetTestQuestionsQuery(numericTestId, {
    skip: Number.isNaN(numericTestId),
  });

  useEffect(() => {
    if (data) {
      dispatch(setQuestions(data));
    }
  }, [data, dispatch]);

  if (testResult) {
    return <PracticalExam testId={numericTestId} testResult={testResult} />;
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
