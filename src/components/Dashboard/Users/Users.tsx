import { useMemo, useState } from "react";
import {
  useCreateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  type AdminUser,
  type AdminUserCreateRequest,
} from "../../../app/services/userApi";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import styles from "./Users.module.css";
import BookLoader from "../../Loaders/Book/Book";

const emptyForm: AdminUserCreateRequest = {
  firstname: "",
  lastname: "",
  className: "",
  language: "uz",
  phoneNumber: "",
  password: "",
};

const Users = () => {
  const { data, isLoading, isFetching } = useGetAdminUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateAdminUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateAdminUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteAdminUserMutation();

  const [form, setForm] = useState<AdminUserCreateRequest>(emptyForm);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classFilter, setClassFilter] = useState<string>("All");
  const [languageFilter, setLanguageFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const users = useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : [];
  }, [data]);

  const classOptions = useMemo(() => {
    const values = users
      .map((u) => u.className)
      .filter((v): v is string => Boolean(v));
    return ["All", ...Array.from(new Set(values))];
  }, [users]);

  const languageOptions = useMemo(() => {
    const values = users
      .map((u) => u.language)
      .filter((v): v is string => Boolean(v));
    return ["All", ...Array.from(new Set(values))];
  }, [users]);

  const roleOptions = useMemo(() => {
    const values = users
      .map((u) => u.roles?.[0]?.role)
      .filter((v): v is string => Boolean(v));
    return ["All", ...Array.from(new Set(values))];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const userRole = u.roles?.[0]?.role ?? "ROLE_USER";
      if (classFilter !== "All" && u.className !== classFilter) return false;
      if (languageFilter !== "All" && u.language !== languageFilter) return false;
      if (roleFilter !== "All" && userRole !== roleFilter) return false;
      if (q) {
        const fullName = `${u.firstname ?? ""} ${u.lastname ?? ""}`
          .trim()
          .toLowerCase();
        if (!fullName.includes(q)) return false;
      }
      return true;
    });
  }, [users, classFilter, languageFilter, roleFilter, search]);

  const handleChange = (key: keyof AdminUserCreateRequest, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const payload: AdminUserCreateRequest = {
      firstname: form.firstname,
      lastname: form.lastname,
      phoneNumber: form.phoneNumber,
      password: form.password,
      className: form.className,
      language: form.language,
    };
    await createUser(payload).unwrap();
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  const handleEdit = (user: AdminUser) => {
    setEditing(user);
    setForm({
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      className: user.className ?? "",
      language: user.language ?? "uz",
      phoneNumber: user.phoneNumber ?? "",
      password: "",
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    await updateUser({ id: editing.id, ...form }).unwrap();
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id).unwrap();
  };

  return (
    <div className={styles.container}>
      {(isLoading || isFetching || isCreating || isUpdating || isDeleting) && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderBox}>
            <BookLoader />
          </div>
        </div>
      )}
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Users</h2>
          <p className={styles.subtitle}>
            {isLoading || isFetching ? "Yuklanmoqda..." : `${users.length} ta`}
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setForm(emptyForm);
            setIsModalOpen(true);
          }}
          className={styles.addButton}
        >
          Add user
        </button>
      </div>

      {/* FILTERS */}
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
                className={`${styles.filterButton} ${
                  classFilter === opt ? styles.filterActive : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Til</span>
          <div className={styles.filterButtons}>
            {languageOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setLanguageFilter(opt)}
                className={`${styles.filterButton} ${
                  languageFilter === opt ? styles.filterActive : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Role</span>
          <div className={styles.filterButtons}>
            {roleOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setRoleFilter(opt)}
                className={`${styles.filterButton} ${
                  roleFilter === opt ? styles.filterActive : ""
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Class</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.firstname}</td>
                <td>{u.lastname}</td>
                <td>{u.className ?? "-"}</td>
                <td>{u.phoneNumber ?? "-"}</td>
                <td>{u.roles?.[0]?.role ?? "ROLE_USER"}</td>
                <td>{u.enabled ? "Enabled" : "Disabled"}</td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => handleEdit(u)}
                      className={styles.iconButton}
                    >
                      <FaRegEdit />
                    </button>

                    <button
                      disabled={isDeleting}
                      onClick={() => handleDelete(u.id)}
                      className={`${styles.iconButton} ${styles.deleteButton}`}
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!filteredUsers.length && !isLoading && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  User topilmadi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                {editing ? "Edit user" : "Add user"}
              </div>

              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditing(null);
                  setForm(emptyForm);
                }}
                className={styles.closeButton}
              >
                Close
              </button>
            </div>

            <div className={styles.formGrid}>
              <input
                className={styles.input}
                value={form.firstname}
                onChange={(e) => handleChange("firstname", e.target.value)}
                placeholder="Firstname"
              />

              <input
                className={styles.input}
                value={form.lastname}
                onChange={(e) => handleChange("lastname", e.target.value)}
                placeholder="Lastname"
              />

              <input
                className={styles.input}
                value={form.className}
                onChange={(e) => handleChange("className", e.target.value)}
                placeholder="Class"
              />

              <input
                className={styles.input}
                value={form.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                placeholder="Phone number"
              />

              <input
                type="password"
                className={styles.input}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Password"
              />

              <select
                className={styles.select}
                value={form.language}
                onChange={(e) => handleChange("language", e.target.value)}
              >
                <option value="uz">uz</option>
                <option value="ru">ru</option>
                <option value="en">en</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <button
                disabled={isCreating || isUpdating}
                onClick={editing ? handleUpdate : handleSubmit}
                className={styles.primaryButton}
              >
                {editing
                  ? isUpdating
                    ? "Updating..."
                    : "Update user"
                  : isCreating
                    ? "Creating..."
                    : "Create user"}
              </button>

              {editing && (
                <button
                  onClick={() => {
                    setEditing(null);
                    setForm(emptyForm);
                  }}
                  className={styles.secondaryButton}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
