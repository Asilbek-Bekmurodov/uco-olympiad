import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ExamDetails.module.css";
import {
  useGetExamByIdQuery,
  useImportQuestionsMutation,
} from "../../../app/services/examApi";
import { toast } from "react-toastify";
import ShowExamQuestions from "./ShowExamQuestions";

const ExamDetails = () => {
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [importQuestions, { isLoading }] = useImportQuestionsMutation();
  const examId = id ? Number(id) : null;
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
            onChange={(e) => {
              const nextFile = e.target.files?.[0] ?? null;
              setFile(nextFile);
            }}
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

      <ShowExamQuestions data={exam?.questions ?? []} />
    </div>
  );
};

export default ExamDetails;
