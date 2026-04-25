import { useNavigate } from "react-router-dom";
import {
  useGetPracticalWorksQuery,
  useSubmitPracticalWorkMutation,
  type SubmitTestResult,
} from "../../app/services/testApi";
import styles from "./PracticalExam.module.css";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

type Props = {
  testId: number;
  testResult: SubmitTestResult;
};

const PracticalExam = ({ testId, testResult }: Props) => {
  const navigate = useNavigate();
  const { data: works = [], isFetching } = useGetPracticalWorksQuery(testId);
  const [submitPractical, { isLoading: isSubmitting }] = useSubmitPracticalWorkMutation();
  const [solutions, setSolutions] = useState<Record<number, string>>({});
  const textareaRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const handleChange = (workId: number, value: string) => {
    setSolutions((prev) => ({ ...prev, [workId]: value }));
  };

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>, workId: number) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const el = textareaRefs.current[workId];
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const current = solutions[workId] ?? "";
    const next = current.substring(0, start) + "  " + current.substring(end);
    setSolutions((prev) => ({ ...prev, [workId]: next }));
    requestAnimationFrame(() => {
      el.selectionStart = start + 2;
      el.selectionEnd = start + 2;
    });
  };

  const handleSubmit = async () => {
    const unanswered = works.filter((w) => !(solutions[w.id] ?? "").trim());
    if (unanswered.length > 0) {
      toast.error(`${unanswered.length} ta topshiriq javobsiz`);
      return;
    }
    const payload = works.map((w) => ({
      practicalWorkId: w.id,
      solutionText: (solutions[w.id] ?? "").trim(),
    }));
    try {
      await submitPractical(payload).unwrap();
      navigate("/home/result", { state: testResult });
    } catch {
      toast.error("Yuborishda xatolik yuz berdi");
    }
  };

  const handleSkip = () => {
    navigate("/home/result", { state: testResult });
  };

  if (isFetching) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Topshiriqlar yuklanmoqda...</p>
      </div>
    );
  }

  if (!works.length) {
    return (
      <div className={styles.emptyWrap}>
        <div className={styles.emptyCard}>
          <p className={styles.emptyText}>Practical topshiriqlar yo'q</p>
          <button className={styles.skipButton} onClick={handleSkip}>
            Natijani ko'rish
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = works.filter((w) => (solutions[w.id] ?? "").trim()).length;
  const allAnswered = answeredCount === works.length;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <h1 className={styles.pageTitle}>Practical topshiriqlar</h1>
          <span className={styles.subtitle}>Test yakunlandi · Kodni yozing va yuboring</span>
        </div>
        <div className={styles.progressWrap}>
          <span className={styles.progressText}>{answeredCount} / {works.length}</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(answeredCount / works.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className={styles.list}>
        {works.map((work, index) => {
          const code = solutions[work.id] ?? "";
          const filled = code.trim().length > 0;
          return (
            <div key={work.id} className={`${styles.card} ${filled ? styles.cardFilled : ""}`}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <span className={styles.index}>{index + 1}</span>
                  <p className={styles.questionText}>{work.questionText}</p>
                </div>
                <div className={styles.cardHeaderRight}>
                  <span className={styles.scoreBadge}>{work.maxScore} ball</span>
                  {work.attachmentUrl && (
                    <a
                      href={work.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.attachLink}
                    >
                      <FiPaperclip size={12} />
                      Ilova
                    </a>
                  )}
                </div>
              </div>

              <div className={styles.editorWrap}>
                <div className={styles.editorTopBar}>
                  <span className={styles.editorLang}>code</span>
                  {filled && <span className={styles.editorDone}>✓ To'ldirildi</span>}
                </div>
                <textarea
                  ref={(el) => { textareaRefs.current[work.id] = el; }}
                  className={styles.editor}
                  placeholder={"// Kodingizni shu yerga yozing...\n"}
                  value={code}
                  onChange={(e) => handleChange(work.id, e.target.value)}
                  onKeyDown={(e) => handleTabKey(e, work.id)}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <div className={styles.editorFooter}>
                  <span className={styles.charCount}>{code.length} belgi</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.submitBar}>
        <button
          type="button"
          className={styles.skipBtn}
          onClick={handleSkip}
          disabled={isSubmitting}
        >
          O'tkazib yuborish
        </button>
        <button
          type="button"
          className={`${styles.submitBtn} ${allAnswered ? styles.submitBtnActive : ""}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <FiSend size={15} />
          {isSubmitting ? "Yuborilmoqda..." : "Javoblarni yuborish"}
        </button>
      </div>
    </div>
  );
};

export default PracticalExam;
