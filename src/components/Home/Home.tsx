import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useGetCountdownQuery } from "../../app/services/userApi";
import { logout } from "../../app/features/auth/authSlice";
import type { RootState } from "../../app/store";
import Logo from "../../assets/site-logo.svg";
import TimerCard from "./TimerCard";
import MyExam from "./MyExam";
import styles from "./Home.module.css";

const formatTime = (value: number) => value.toString().padStart(2, "0");

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((s: RootState) => s.auth.role);
  const { data } = useGetCountdownQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });
  const [remaining, setRemaining] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastServerSeconds = useRef<number | null>(null);

  // Initialize countdown when new data arrives
  const totalSeconds = useMemo(() => {
    if (!data) return null;
    return (
      (((data.days ?? 0) * 24 + (data.hours ?? 0)) * 60 + (data.minutes ?? 0)) *
        60 +
      (data.seconds ?? 0)
    );
  }, [data?.days, data?.hours, data?.minutes, data?.seconds]);

  useEffect(() => {
    if (totalSeconds === null) return;
    if (lastServerSeconds.current === totalSeconds) return;
    lastServerSeconds.current = totalSeconds;
    const id = setTimeout(() => setRemaining(totalSeconds), 0);
    return () => clearTimeout(id);
  }, [totalSeconds]);
  // Tick every second
  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev === null ? null : Math.max(0, prev - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const breakdown = useMemo(() => {
    const total = remaining ?? 0;
    const days = Math.floor(total / (24 * 3600));
    const hours = Math.floor((total % (24 * 3600)) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return { days, hours, minutes, seconds };
  }, [remaining]);

  const statusText = data?.message ?? "Yuklanmoqda...";
  const showExam = data?.isStarted && (remaining ?? 0) === 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const location = useLocation();
  const isExamRoute =
    location.pathname.startsWith("/home/my-exam/") ||
    location.pathname.startsWith("/home/result");

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <img className={styles.logo} src={Logo} alt="" />
        </div>

        <div className={styles.userMenu}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className={styles.avatarButton}
          >
            {role ? role[0]?.toUpperCase() : "U"}
          </button>
          {dropdownOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                Rol: {role ?? "no role"}
              </div>
              <button className={styles.dropdownItem}>Profile settings</button>
              <button
                onClick={handleLogout}
                className={styles.dropdownItemDanger}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className={styles.content}>
        {isExamRoute ? (
          <div className={styles.cardShell}>
            <Outlet />
          </div>
        ) : (
          <div className={styles.cardShell}>
            {showExam ? (
              <MyExam />
            ) : (
              <TimerCard
                breakdown={breakdown}
                status={statusText}
                formatTime={formatTime}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
