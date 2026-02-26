import { FiX } from "react-icons/fi";
import styles from "./ShowExamQuestions.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeQuestionId: number | null;
  file: File | null;
  previewUrl: string | null;
  onFileChange: (file: File | null) => void;
  onPreviewOpen: () => void;
  onUpload: () => void;
  isUploading: boolean;
};

const ImageUploadModal = ({
  isOpen,
  onClose,
  activeQuestionId,
  file,
  previewUrl,
  onFileChange,
  onPreviewOpen,
  onUpload,
  isUploading,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Rasm yuklash</div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <p className={styles.modalHint}>Savol ID: {activeQuestionId}</p>

        <label className={styles.uploadBox}>
          <input
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
          <span className={styles.uploadText}>
            {file ? file.name : "Rasm tanlash"}
          </span>
          <span className={styles.uploadSub}>Faqat 1 ta rasm</span>
        </label>

        {previewUrl && (
          <div className={styles.previewWrap}>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onFileChange(null)}
            >
              <FiX />
            </button>
            <img src={previewUrl} alt="preview" onClick={onPreviewOpen} />
          </div>
        )}
        <button
          type="button"
          className={styles.uploadAction}
          onClick={onUpload}
          disabled={!file || !activeQuestionId || isUploading}
        >
          {isUploading ? "Yuklanmoqda..." : "Yuklash"}
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModal;
