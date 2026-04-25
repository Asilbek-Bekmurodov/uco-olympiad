import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ExamDetails.module.css";
import {
  useGetExamByIdQuery,
  useImportQuestionsMutation,
  useAddPracticalWorkMutation,
} from "../../../app/services/examApi";
import { toast } from "react-toastify";
import ShowExamQuestions from "./ShowExamQuestions";
import ShowPracticalQuestions from "./ShowPracticalQuestions";

const emptyForm = { questionText: "", maxScore: "" as string | number };

const ExamDetails = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [importQuestions, { isLoading }] = useImportQuestionsMutation();
  const [addPracticalWork, { isLoading: isPracticalLoading }] =
    useAddPracticalWorkMutation();
  const examId = id ? Number(id) : null;

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
    </div>
  );
};

export default ExamDetails;
