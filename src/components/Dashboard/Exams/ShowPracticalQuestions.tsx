import { useState } from "react";
import { FiEdit2, FiTrash2, FiX, FiPaperclip } from "react-icons/fi";
import { toast } from "react-toastify";
import styles from "./ShowPracticalQuestions.module.css";
import type { PracticalWorkResponse } from "../../../app/services/examApi";
import {
  useEditPracticalWorkMutation,
  useDeletePracticalWorkMutation,
} from "../../../app/services/examApi";

type Props = {
  data: PracticalWorkResponse[];
};

type EditForm = { questionText: string; maxScore: string | number };

const ShowPracticalQuestions = ({ data }: Props) => {
  const [editTarget, setEditTarget] = useState<PracticalWorkResponse | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ questionText: "", maxScore: "" });
  const [editFile, setEditFile] = useState<File | null>(null);

  const [editPracticalWork, { isLoading: isEditing }] = useEditPracticalWorkMutation();
  const [deletePracticalWork, { isLoading: isDeleting }] = useDeletePracticalWorkMutation();

  const openEdit = (item: PracticalWorkResponse) => {
    setEditTarget(item);
    setEditForm({ questionText: item.questionText, maxScore: item.maxScore });
    setEditFile(null);
  };

  const closeEdit = () => {
    setEditTarget(null);
    setEditFile(null);
  };

  const handleSave = async () => {
    if (!editTarget) return;
    if (!editForm.questionText.toString().trim()) {
      toast.error("Savol matnini kiriting");
      return;
    }
    const maxScore = Number(editForm.maxScore);
    if (!maxScore || maxScore <= 0) {
      toast.error("To'g'ri ball kiriting");
      return;
    }
    try {
      await editPracticalWork({
        workId: editTarget.id,
        body: { questionText: editForm.questionText.trim(), maxScore },
        ...(editFile && { file: editFile }),
      }).unwrap();
      toast.success("Practical savol yangilandi");
      closeEdit();
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  const handleDelete = async (workId: number) => {
    try {
      await deletePracticalWork(workId).unwrap();
      toast.success("Practical savol o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Practical savollar</h2>
          <span className={styles.count}>{data.length} ta</span>
        </div>

        <div className={styles.list}>
          {data.map((item, index) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.index}>{index + 1}</span>
                <p className={styles.questionText}>{item.questionText}</p>
              </div>

              <div className={styles.cardBottom}>
                <div className={styles.meta}>
                  <span className={styles.scoreBadge}>{item.maxScore} ball</span>
                  {item.attachmentUrl && (
                    <a
                      href={item.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.attachLink}
                    >
                      <FiPaperclip size={12} />
                      Ilova
                    </a>
                  )}
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={() => openEdit(item)}
                    disabled={isDeleting}
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editTarget && (
        <div className={styles.overlay} onClick={closeEdit}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Practical savolni tahrirlash</h3>
              <button type="button" className={styles.closeButton} onClick={closeEdit}>
                <FiX size={16} />
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Savol matni <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.formTextarea}
                rows={4}
                value={editForm.questionText}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, questionText: e.target.value }))
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
                  min={1}
                  value={editForm.maxScore}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, maxScore: e.target.value }))
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
                    onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
                  />
                  <span className={styles.filePickerText}>
                    {editFile ? editFile.name : "Fayl tanlash"}
                  </span>
                </label>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={closeEdit}
                disabled={isEditing}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSave}
                disabled={isEditing}
              >
                {isEditing ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowPracticalQuestions;
