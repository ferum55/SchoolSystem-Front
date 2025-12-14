import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

type ClassInfo = {
  id: number;
  name: string;
  year: number;
};

type SubjectInfo = {
  id: number;
  name: string;
  description: string;
};

export default function StudentDashboardPage() {
  const navigate = useNavigate();
  const studentId = Number(localStorage.getItem("userId"));
  const studentName = localStorage.getItem("name") || "Student";

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const clsRes = await api.get(`/classes/by-student/${studentId}`);
        setClassInfo(clsRes.data);

        const subjRes = await api.get(`/classes/${clsRes.data.id}/subjects`);
        setSubjects(subjRes.data);

        const notifRes = await api.get(
          `/notifications/user/${studentId}?page=1&pageSize=1`
        );

        setUnreadCount(notifRes.data.total);
      } catch (e) {
        console.error("Failed to load student dashboard", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [studentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>
          Welcome, {studentName}
          {classInfo ? ` (${classInfo.name})` : ""}
        </h2>

        <button
          onClick={() => navigate("/student/notifications")}
          style={{
            position: "relative",
            fontSize: 24,
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: 12,
                fontWeight: "bold"
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <h3>Your Subjects</h3>

      {subjects.length === 0 && <p>No subjects assigned</p>}

      <ul>
        {subjects.map(s => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            <Link
              to={`/student/subject/${s.id}/class/${classInfo?.id}`}
              style={{ fontSize: 18 }}
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
