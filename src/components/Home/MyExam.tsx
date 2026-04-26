import { useNavigate } from "react-router-dom";
import {
  useGetMyExamsQuery,
  useStartExamMutation,
} from "../../app/services/testApi";
import { useAppDispatch } from "../../app/hooks";
import { setSession } from "../../app/features/test/testSlice";
import styles from "./MyExam.module.css";

const MyExam = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading, isFetching } = useGetMyExamsQuery();
  const [startExam] = useStartExamMutation();
  const exams = Array.isArray(data) ? data : [];

  const handleStart = async (examId?: number) => {
    if (!examId) return;
    const result = await startExam(examId).unwrap();

    dispatch(
      setSession({
        testId: result.id,
        startTime: result.startTime,
        durationMinutes: result.durationMinutes,
        examId,
      }),
    );
    navigate(`/home/my-exam/${result.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>My Exams</h2>
          <p className={styles.subtitle}>
            {isLoading || isFetching ? "Yuklanmoqda..." : `${exams.length} ta`}
          </p>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className={styles.loading}>Yuklanmoqda...</div>
      ) : exams.length ? (
        <div className={styles.grid}>
          {exams.map((exam) => (
            <div key={exam.id ?? exam.title} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.cardTitle}>
                    {exam.title ?? "Untitled exam"}
                  </h3>
                  <p className={styles.cardSubject}>
                    {exam.subject ?? "Subject noma’lum"}
                  </p>
                </div>
                <span className={styles.duration}>
                  {exam.durationMinutes ?? "-"} daqiqa
                </span>
              </div>

              <div className={styles.metaGrid}>
                <div>
                  <div className={styles.metaLabel}>Sinf</div>
                  <div className={styles.metaValue}>
                    {exam.className ?? "-"}
                  </div>
                </div>
                <div>
                  <div className={styles.metaLabel}>Til</div>
                  <div className={styles.metaValue}>{exam.language ?? "-"}</div>
                </div>
              </div>

              <div className={styles.action}>
                <button
                  className={styles.startButton}
                  onClick={() => handleStart(exam.id)}
                >
                  Start exam
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>Imtihon topilmadi</div>
      )}
    </div>
  );
};

export default MyExam;
