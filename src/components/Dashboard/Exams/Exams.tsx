import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Exams.module.css";
import {
  useCreateExamMutation,
  useDeleteExamMutation,
  useEditExamMutation,
  useGetExamQuery,
  useToggleExamVisibilityMutation,
} from "../../../app/services/examApi";
import { toast } from "react-toastify";
import { BiEdit } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import BookLoader from "../../Loaders/Book/Book";

type FormDataType = {
  title: string;
  durationMinutes: string;
  className: string;
  subject: string;
  language: string;
  maxScore: string;
  passingScore: string;
};

const Exams = () => {
  const navigate = useNavigate();
  const grades = Array.from({ length: 9 }, (_, i) => i + 3);
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const { data: exams, isLoading: isExamsLoading } = useGetExamQuery();
  const [deleteExam, { isLoading: isDeleteLoading }] = useDeleteExamMutation();
  const [editExam, { isLoading: isEditing }] = useEditExamMutation();
  const [toggleVisibility] = useToggleExamVisibilityMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [visibilityOverrides, setVisibilityOverrides] = useState<
    Record<number, boolean>
  >({});
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    durationMinutes: "",
    className: "",
    subject: "",
    language: "",
    maxScore: "",
    passingScore: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value } = e.target;
    const name = e.target.name as keyof FormDataType;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        durationMinutes: Number(formData.durationMinutes),
        maxScore: Number(formData.maxScore),
        passingScore: Number(formData.passingScore),
      };
      if (editingId != null) {
        await editExam({ id: editingId, ...payload }).unwrap();
        toast.success("Imtihon yangilandi");
      } else {
        await createExam(payload).unwrap();
        toast.success("Imtihon yaratildi");
      }
      setEditingId(null);
      setFormData({
        title: "",
        durationMinutes: "",
        className: "",
        subject: "",
        language: "",
        maxScore: "",
        passingScore: "",
      });
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className={styles.container}>
      {(isExamsLoading || isCreating || isEditing || isDeleteLoading) && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderBox}>
            <BookLoader />
          </div>
        </div>
      )}
      <div className={styles.header}>
        <div>
          <h2 className={styles.pageTitle}>Imtihonlar</h2>
          <div className={styles.subtitle}>
            {isExamsLoading ? "Yuklanmoqda..." : `${exams?.length ?? 0} ta`}
          </div>
        </div>
        <button
          className={styles.createButton}
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({
              title: "",
              durationMinutes: "",
              className: "",
              subject: "",
              language: "",
              maxScore: "",
              passingScore: "",
            });
            setIsModalOpen(true);
          }}
        >
          Create exam
        </button>
      </div>

      <div className={styles.listCard}>
        <div className={styles.listHeader}>
          <div>#</div>
          <div>Nomi</div>
          <div>Fan</div>
          <div>Sinf</div>
          <div>Til</div>
          <div>Davomiyligi</div>
          <div>Ko'rinish</div>
          <div className={styles.actionsHeader}>Amallar</div>
        </div>
        <ul className={styles.list}>
          {exams?.length ? (
            exams.map((exam, index) => (
              <li
                key={exam.id ?? `${exam.title}-${index}`}
                className={styles.listRow}
                onClick={() => {
                  if (exam.id == null) return;
                  navigate(`/dashboard/exams/${exam.id}`);
                }}
              >
                <span className={styles.listCell}>{index + 1}</span>
                <span className={styles.listCell}>{exam.title}</span>
                <span className={styles.listCell}>{exam.subject}</span>
                <span className={styles.listCell}>{exam.className}</span>
                <span className={styles.badge}>{exam.language}</span>
                <span className={styles.listCell}>
                  {exam.durationMinutes} min
                </span>
                <span className={styles.listCell}>
                  {(() => {
                    const isVisible =
                      exam.id != null &&
                      visibilityOverrides[exam.id] !== undefined
                        ? visibilityOverrides[exam.id]
                        : Boolean(exam.visible);
                    return (
                      <div
                        className={`${styles.toggle} ${
                          isVisible ? styles.toggleOn : styles.toggleOff
                        }`}
                        role="switch"
                        aria-checked={isVisible}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (exam.id == null) return;
                          toggleVisibility({ id: exam.id })
                            .unwrap()
                            .then((res) => {
                              if (typeof res.visible === "boolean") {
                                setVisibilityOverrides((prev) => ({
                                  ...prev,
                                  [exam.id as number]: res.visible as boolean,
                                }));
                                toast.success(
                                  res.visible ? "Ko'rinadi" : "Yashirildi",
                                );
                              } else {
                                toast.error("Natija noto'g'ri");
                              }
                            })
                            .catch(() => {
                              toast.error("Xatolik yuz berdi");
                            });
                        }}
                      >
                        <span className={styles.toggleDot} />
                      </div>
                    );
                  })()}
                </span>
                <span className={styles.actions}>
                  <button
                    className={styles.iconButton}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(exam.id ?? null);
                      setFormData({
                        title: exam.title ?? "",
                        durationMinutes: String(exam.durationMinutes ?? ""),
                        className: exam.className ?? "",
                        subject: exam.subject ?? "",
                        language: exam.language ?? "",
                        maxScore: String(exam.maxScore ?? ""),
                        passingScore: String(exam.passingScore ?? ""),
                      });
                      setIsModalOpen(true);
                    }}
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (exam.id == null) return;
                      deleteExam(exam.id);
                    }}
                    className={styles.iconButton}
                    type="button"
                    disabled={exam.id == null}
                  >
                    <FiDelete />
                  </button>
                </span>
              </li>
            ))
          ) : (
            <li className={styles.emptyRow}>Hozircha imtihonlar yo'q</li>
          )}
        </ul>
      </div>

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.card}>
            <div className={styles.modalHeader}>
              <h2 className={styles.title}>
                {editingId != null ? "Imtihon tahrirlash" : "Imtihon yaratish"}
              </h2>
              <button
                className={styles.closeButton}
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Yopish
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Imtihon nomi</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title..."
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Imtihon davomiyligi</label>
                  <input
                    className={styles.input}
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    placeholder="Duration..."
                    required
                    min={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Sinfni tanang</label>
                  <select
                    className={styles.select}
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Tanlang</option>
                    {grades.map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Fanni tanlang</label>
                  <select
                    className={styles.select}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Tanlang</option>
                    <option value="javascript">Javascript/sql</option>
                    <option value="java">Java </option>
                    <option value="python">Python </option>
                    <option value="scratch">Scratch</option>
                    <option value="C++">C++ </option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Til</label>
                  <select
                    className={styles.select}
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Tanlang</option>
                    <option value="uz">uz</option>
                    <option value="ru">ru</option>
                    <option value="en">en</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Max ball</label>
                  <input
                    className={styles.input}
                    type="number"
                    name="maxScore"
                    value={formData.maxScore}
                    onChange={handleChange}
                    placeholder="Max score..."
                    required
                    min={1}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>O'tish balli</label>
                  <input
                    className={styles.input}
                    type="number"
                    name="passingScore"
                    value={formData.passingScore}
                    onChange={handleChange}
                    placeholder="Passing score..."
                    required
                    min={0}
                  />
                </div>
              </div>

              <button className={styles.button} type="submit">
                {isCreating || isEditing
                  ? "Saqlanmoqda"
                  : editingId != null
                    ? "Yangilash"
                    : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
