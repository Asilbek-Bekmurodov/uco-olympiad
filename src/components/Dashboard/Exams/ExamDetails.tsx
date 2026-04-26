import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ExamDetails.module.css";
import {
  useGetExamByIdQuery,
  useImportQuestionsMutation,
  useAddPracticalWorkMutation,
  useGetSubmissionsByExamIdQuery,
  useGradeSubmissionMutation,
  type ExamSubmission,
} from "../../../app/services/examApi";
import { toast } from "react-toastify";
import ShowExamQuestions from "./ShowExamQuestions";
import ShowPracticalQuestions from "./ShowPracticalQuestions";

const emptyForm = { questionText: "", maxScore: "" as string | number };

const statusColor: Record<string, string> = {
  SUBMITTED: styles.statusSubmitted,
  GRADED: styles.statusGraded,
  PENDING: styles.statusPending,
};

const ExamDetails = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [importQuestions, { isLoading }] = useImportQuestionsMutation();
  const [addPracticalWork, { isLoading: isPracticalLoading }] =
    useAddPracticalWorkMutation();
  const examId = id ? Number(id) : null;

  const { data: submissions, isLoading: isSubmissionsLoading } =
    useGetSubmissionsByExamIdQuery(examId ?? 0, {
      skip: examId == null || Number.isNaN(examId),
    });

  const [gradeSubmission, { isLoading: isGrading }] = useGradeSubmissionMutation();
  const [gradingRow, setGradingRow] = useState<number | null>(null);
  const [gradeForm, setGradeForm] = useState<{ score: string; feedback: string }>({
    score: "",
    feedback: "",
  });

  const handleGrade = async (sub: ExamSubmission) => {
    const score = Number(gradeForm.score);
    if (Number.isNaN(score) || score < 0 || score > sub.maxScore) {
      toast.error(`Ball 0 dan ${sub.maxScore} gacha bo'lishi kerak`);
      return;
    }
    try {
      await gradeSubmission({
        submissionId: sub.submissionId,
        score,
        feedback: gradeForm.feedback || undefined,
      }).unwrap();
      toast.success("Ball saqlandi");
      setGradingRow(null);
      setGradeForm({ score: "", feedback: "" });
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const [practicalForm, setPracticalForm] = useState(emptyForm);
  const [practicalFile, setPracticalFile] = useState<File | null>(null);

  const { data: exam } = useGetExamByIdQuery(examId ?? 0, {
    skip: examId == null || Number.isNaN(examId),
  });

  const handleImport = async () => {
    if (!id) {
      toast.error("Exam ID topilmadi");
      return;
    }
    if (!file) {
      toast.error("Fayl tanlang");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      await importQuestions({ id: Number(id), formData }).unwrap();
      toast.success("Savollar yuklandi");
      setFile(null);
    } catch (error) {
      console.log(error);
      toast.error("Yuklashda xatolik");
    }
  };

  const handlePracticalSubmit = async () => {
    if (!id) return;

    if (!practicalForm.questionText.trim()) {
      toast.error("Savol matnini kiriting");
      return;
    }
    const maxScore = Number(practicalForm.maxScore);
    if (!maxScore || maxScore <= 0) {
      toast.error("To'g'ri ball kiriting");
      return;
    }

    try {
      await addPracticalWork({
        examId: Number(id),
        body: {
          questionText: practicalForm.questionText.trim(),
          maxScore,
        },
        ...(practicalFile && { file: practicalFile }),
      }).unwrap();

      toast.success("Practical savol qo'shildi");
      setPracticalForm(emptyForm);
      setPracticalFile(null);
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/dashboard/exams" className={styles.backLink}>
          Ortga qaytish
        </Link>
        <h2 className={styles.title}>
          {exam?.title ? exam.title : `Exam #${id}`}
        </h2>
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>
          Excel file orqali savollar qo'shish
        </h3>
        <p className={styles.sectionHint}>`.xlsx` formatdagi faylni tanlang.</p>
        <label className={styles.uploadBox}>
          <input
            type="file"
            className={styles.fileInput}
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <span className={styles.uploadText}>
            {file ? file.name : "Fayl tanlash"}
          </span>
          <span className={styles.uploadSub}>Drag & drop yoki bosing</span>
        </label>
        <button
          type="button"
          className={styles.uploadButton}
          onClick={handleImport}
          disabled={isLoading}
        >
          {isLoading ? "Yuklanmoqda..." : "Yuklash"}
        </button>
      </div>

      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>Practical savol qo'shish</h3>

        <div className={styles.practicalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Savol matni <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.formTextarea}
              placeholder="Practical savol matnini kiriting..."
              rows={4}
              value={practicalForm.questionText}
              onChange={(e) =>
                setPracticalForm((f) => ({ ...f, questionText: e.target.value }))
              }
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Maksimal ball <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                className={styles.formInput}
                placeholder="0"
                min={1}
                value={practicalForm.maxScore}
                onChange={(e) =>
                  setPracticalForm((f) => ({ ...f, maxScore: e.target.value }))
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Fayl <span className={styles.optional}>(ixtiyoriy)</span>
              </label>
              <label className={styles.filePickerLabel}>
                <input
                  type="file"
                  className={styles.fileInput}
                  onChange={(e) =>
                    setPracticalFile(e.target.files?.[0] ?? null)
                  }
                />
                <span className={styles.filePickerText}>
                  {practicalFile ? practicalFile.name : "Fayl tanlash"}
                </span>
              </label>
            </div>
          </div>

          <button
            type="button"
            className={styles.uploadButton}
            onClick={handlePracticalSubmit}
            disabled={isPracticalLoading}
          >
            {isPracticalLoading ? "Saqlanmoqda..." : "Qo'shish"}
          </button>
        </div>
      </div>
      <ShowPracticalQuestions data={exam?.practicalWorks ?? []} />
      <ShowExamQuestions data={exam?.questions ?? []} />

      {/* Submissions */}
      <div className={styles.card}>
        <h3 className={styles.sectionTitle}>
          Amaliy topshiriqlar natijalari
          {!isSubmissionsLoading && (
            <span className={styles.countBadge}>
              {submissions?.length ?? 0} ta
            </span>
          )}
        </h3>
        <p className={styles.sectionHint}>
          O'quvchilar tomonidan yuborilgan amaliy ishlar
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.subTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>O'quvchi</th>
                <th>Sinf</th>
                <th>Savol</th>
                <th>Javob</th>
                <th>Status</th>
                <th>Ball</th>
                <th>Max ball</th>
                <th>Izoh</th>
                <th>Baholash</th>
              </tr>
            </thead>
            <tbody>
              {isSubmissionsLoading ? (
                <tr>
                  <td colSpan={10} className={styles.emptyRow}>
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : submissions?.length ? (
                submissions.map((sub, i) => (
                  <tr key={sub.submissionId}>
                    <td>{i + 1}</td>
                    <td>
                      {sub.userFirstName} {sub.userLastName}
                    </td>
                    <td>{sub.userClassName}</td>
                    <td className={styles.textCell}>{sub.questionText}</td>
                    <td className={styles.textCell}>{sub.solutionText ?? "-"}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${statusColor[sub.status] ?? ""}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td>{sub.score ?? "-"}</td>
                    <td>{sub.maxScore}</td>
                    <td className={styles.textCell}>{sub.feedback ?? "-"}</td>
                    <td>
                      {gradingRow === sub.submissionId ? (
                        <div className={styles.gradeForm}>
                          <input
                            type="number"
                            className={styles.gradeInput}
                            placeholder={`0-${sub.maxScore}`}
                            min={0}
                            max={sub.maxScore}
                            value={gradeForm.score}
                            onChange={(e) =>
                              setGradeForm((f) => ({ ...f, score: e.target.value }))
                            }
                          />
                          <input
                            type="text"
                            className={styles.gradeInput}
                            placeholder="Izoh (ixtiyoriy)"
                            value={gradeForm.feedback}
                            onChange={(e) =>
                              setGradeForm((f) => ({ ...f, feedback: e.target.value }))
                            }
                          />
                          <div className={styles.gradeActions}>
                            <button
                              type="button"
                              className={styles.saveBtn}
                              disabled={isGrading}
                              onClick={() => handleGrade(sub)}
                            >
                              Saqlash
                            </button>
                            <button
                              type="button"
                              className={styles.cancelBtn}
                              onClick={() => setGradingRow(null)}
                            >
                              Bekor
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className={styles.gradeBtn}
                          onClick={() => {
                            setGradingRow(sub.submissionId);
                            setGradeForm({
                              score: sub.score != null ? String(sub.score) : "",
                              feedback: sub.feedback ?? "",
                            });
                          }}
                        >
                          Baholash
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className={styles.emptyRow}>
                    Hali javoblar yo'q
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
