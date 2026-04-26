import { useMemo, useState } from "react";
import {
  useGetAdminResultsQuery,
  type AdminResult,
} from "../../../app/services/userApi";
import BookLoader from "../../Loaders/Book/Book";
import styles from "./Results.module.css";

const statusColor: Record<string, string> = {
  STARTED: styles.statusStarted,
  FINISHED: styles.statusFinished,
  NOT_STARTED: styles.statusNotStarted,
};

const Results = () => {
  const { data, isLoading, isFetching } = useGetAdminResultsQuery();
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const results: AdminResult[] = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  }, [data]);

  const classOptions = useMemo(() => {
    const vals = results
      .map((r) => r.className)
      .filter((v): v is string => Boolean(v));
    return ["All", ...Array.from(new Set(vals))];
  }, [results]);

  const statusOptions = useMemo(() => {
    const vals = results.map((r) => r.status).filter(Boolean);
    return ["All", ...Array.from(new Set(vals))];
  }, [results]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return results.filter((r) => {
      if (classFilter !== "All" && r.className !== classFilter) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      if (q) {
        const name = `${r.firstname ?? ""} ${r.lastname ?? ""}`.toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [results, classFilter, statusFilter, search]);

  return (
    <div className={styles.container}>
      {(isLoading || isFetching) && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderBox}>
            <BookLoader />
          </div>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Results</h2>
          <p className={styles.subtitle}>
            {isLoading || isFetching
              ? "Yuklanmoqda..."
              : `${filtered.length} ta natija`}
          </p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchRow}>
          <span className={styles.filterLabel}>Search</span>
          <input
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism yoki familiya"
          />
          {search && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Sinf</span>
          <div className={styles.filterButtons}>
            {classOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setClassFilter(opt)}
                className={`${styles.filterButton} ${classFilter === opt ? styles.filterActive : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status</span>
          <div className={styles.filterButtons}>
            {statusOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStatusFilter(opt)}
                className={`${styles.filterButton} ${statusFilter === opt ? styles.filterActive : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Ism</th>
              <th>Familiya</th>
              <th>Telefon</th>
              <th>Sinf</th>
              <th>Imtihon</th>
              <th>To'g'ri</th>
              <th>Jami</th>
              <th>Ball</th>
              <th>Status</th>
              <th>O'tdi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={`${r.userId}-${i}`}>
                <td>{i + 1}</td>
                <td>{r.firstname}</td>
                <td>{r.lastname}</td>
                <td>{r.phoneNumber ?? "-"}</td>
                <td>{r.className ?? "-"}</td>
                <td>{r.examTitle ?? "-"}</td>
                <td>{r.correctAnswers ?? "-"}</td>
                <td>{r.totalQuestions ?? "-"}</td>
                <td>{r.score ?? "-"}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${statusColor[r.status] ?? ""}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.passedBadge} ${r.passed ? styles.passedTrue : styles.passedFalse}`}
                  >
                    {r.passed ? "Ha" : "Yo'q"}
                  </span>
                </td>
              </tr>
            ))}
            {!filtered.length && !isLoading && (
              <tr>
                <td colSpan={11} className={styles.emptyRow}>
                  Natija topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
