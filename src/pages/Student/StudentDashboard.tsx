import { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

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
  const studentId = Number(localStorage.getItem("userId"));
  const studentName = localStorage.getItem("name") || "Student";

  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    loadClass();
    loadNotifications();
  }, []);

  const loadClass = async () => {
    const res = await api.get(`/classes/by-student/${studentId}`);
    setClassInfo(res.data);

    const subjectsRes = await api.get(`/classes/${res.data.id}/subjects`);
    setSubjects(subjectsRes.data);
  };

  const loadNotifications = async () => {
    const res = await api.get(`/notifications/user/${studentId}`);
    setNotifications(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Welcome, {studentName}</h2>

        {/* Bell icon */}
        <button onClick={() => setNotifOpen(!notifOpen)} style={{ fontSize: 20 }}>
          🔔 ({notifications.length})
        </button>
      </div>

      {notifOpen && (
        <div
          style={{
            border: "1px solid gray",
            padding: 10,
            marginBottom: 20,
            background: "#fafafa",
            maxWidth: 400,
          }}
        >
          <h4>Notifications</h4>
          {notifications.length === 0 && <p>No notifications yet</p>}

          <ul>
            {notifications.map((n) => (
              <li key={n.id}>{n.message}</li>
            ))}
          </ul>
        </div>
      )}

      <h3>Your Subjects</h3>

      {subjects.length === 0 && <p>No subjects assigned</p>}

      <ul>
        {subjects.map((s) => (
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
