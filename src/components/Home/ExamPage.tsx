import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetTestQuestionsQuery } from "../../app/services/testApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setQuestions } from "../../app/features/test/testSlice";
import Pagination from "./ExamPage/Pagination";
import Title from "./ExamPage/Title";
import QuestionImage from "./ExamPage/QuestionImage";
import Options from "./ExamPage/Options";
import Footer from "./ExamPage/Footer";
import styles from "./ExamPage/ExamPage.module.css";

const ExamPage = () => {
  const { testId } = useParams();
  const numericTestId = testId ? Number(testId) : NaN;
  const dispatch = useAppDispatch();
  const questions = useAppSelector((s) => s.test.questions);

  const { data, isFetching } = useGetTestQuestionsQuery(numericTestId, {
    skip: Number.isNaN(numericTestId),
  });

  useEffect(() => {
    if (data) {
      dispatch(setQuestions(data));
      console.log("Test questions:", data);
    }
  }, [data, dispatch]);

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
      <Footer />
    </div>
  );
};

export default ExamPage;
