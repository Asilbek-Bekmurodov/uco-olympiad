import { useEffect, useMemo, useState } from "react";
import styles from "./ShowExamQuestions.module.css";
import type { ExamQuestion } from "../../../app/services/examApi";
import {
  useDeleteQuestionMutation,
  useImportQuestionImageMutation,
} from "../../../app/services/examApi";
import { BiPlus } from "react-icons/bi";
import ImageUploadModal from "./ShowExamQuestionsModal";
import { FiDelete } from "react-icons/fi";
import BookLoader from "../../Loaders/Book/Book";

type Props = {
  data: ExamQuestion[];
};

const ShowExamQuestions = ({ data }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [importImage, { isLoading: isUploading }] =
    useImportQuestionImageMutation();
  const [deleteQuestion, { isLoading: isDeleting }] =
    useDeleteQuestionMutation();

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleDelete(id: number) {
    try {
      await deleteQuestion(id).unwrap();
    } catch (err) {
      console.log(err);
    }
  }

  const handlePickImage = (questionId: number) => {
    setActiveQuestionId(questionId);
    setFile(null);
    setIsPreviewOpen(false);
    setIsModalOpen(true);
  };

  const handleFileChange = (nextFile: File | null) => {
    setFile(nextFile);
    setIsPreviewOpen(false);
    if (!nextFile) return;

    const formData = new FormData();
    formData.append("file", nextFile);
    console.log("formData", Array.from(formData.entries()));
  };

  const handleUploadImage = async () => {
    if (!activeQuestionId || !file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      await importImage({ id: activeQuestionId, formData }).unwrap();
      console.log("image uploaded", activeQuestionId);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  if (isDeleting) return <BookLoader />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Savollar</h2>
        <span className={styles.count}>{data.length} ta</span>
      </div>

      <div className={styles.list}>
        {data.map((q, index) => (
          <div key={q.id ?? index} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.qTitle}>
                {index + 1}. {q.text}
              </div>
              {q.points != null && (
                <div className={styles.pointsRow}>
                  <div className={styles.points}>{q.points} ball</div>
                  <button
                    onClick={() => handleDelete(q.id)}
                    type="button"
                    className={styles.deleteButton}
                  >
                    <FiDelete />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.addImageButton}
              onClick={() => handlePickImage(q.id)}
            >
              <BiPlus />
              Rasm qo'shish
            </button>

            {q.imageUrl && (
              <div className={styles.imageWrap}>
                <img src={q.imageUrl} alt="" />
              </div>
            )}

            <ul className={styles.options}>
              {q.options?.map((opt, optIndex) => (
                <li key={opt.id ?? optIndex} className={styles.option}>
                  <span className={styles.optionLetter}>
                    {String.fromCharCode(65 + optIndex)}.
                  </span>
                  <span className={styles.optionText}>{opt.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ImageUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeQuestionId={activeQuestionId}
        file={file}
        previewUrl={previewUrl}
        onFileChange={handleFileChange}
        onPreviewOpen={() => setIsPreviewOpen(true)}
        onUpload={handleUploadImage}
        isUploading={isUploading}
      />

      {isPreviewOpen && previewUrl && (
        <div
          className={styles.previewOverlay}
          onClick={() => setIsPreviewOpen(false)}
        >
          <img src={previewUrl} alt="preview-large" />
        </div>
      )}
    </div>
  );
};

export default ShowExamQuestions;
