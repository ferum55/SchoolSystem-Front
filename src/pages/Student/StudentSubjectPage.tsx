import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

type Grade = {
  id: number;
  score: number;
  type: string;
  comment: string;
  date: string;
};

type Homework = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
};

type Attendance = {
  id: number;
  status: string;
  reason: string;
  date: string;
};

export default function StudentSubjectPage() {
  const { classId, subjectId } = useParams();
  const studentId = Number(localStorage.getItem("userId"));

  const [tab, setTab] = useState<"grades" | "homework" | "attendance">(
    "grades"
  );

  const [grades, setGrades] = useState<Grade[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);

    const gradesRes = await api.get(
      `/grades/student/${studentId}/subject/${subjectId}`
    );

    const hwRes = await api.get(
      `/homework/class/${classId}/subject/${subjectId}`
    );

    const attRes = await api.get(
      `/attendance/student/${studentId}/subject/${subjectId}`
    );

    setGrades(gradesRes.data);
    setHomework(hwRes.data);
    setAttendance(attRes.data);

    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Subject #{subjectId}</h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <button onClick={() => setTab("grades")} style={{ fontWeight: tab === "grades" ? "bold" : "normal" }}>
          Grades
        </button>
        <button onClick={() => setTab("homework")} style={{ fontWeight: tab === "homework" ? "bold" : "normal" }}>
          Homework
        </button>
        <button onClick={() => setTab("attendance")} style={{ fontWeight: tab === "attendance" ? "bold" : "normal" }}>
          Attendance
        </button>
      </div>

      {/* ---------------- GRADES ---------------- */}
      {tab === "grades" && (
        <table border={1} cellPadding={8} style={{ marginBottom: 20 }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Type</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id}>
                <td>{new Date(g.date).toLocaleDateString()}</td>
                <td>{g.score}</td>
                <td>{g.type}</td>
                <td>{g.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- HOMEWORK ---------------- */}
      {tab === "homework" && (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Created</th>
              <th>Due</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {homework.map((hw) => (
              <tr key={hw.id}>
                <td>{new Date(hw.createdAt).toLocaleDateString()}</td>
                <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
                <td>{hw.title}</td>
                <td>{hw.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ---------------- ATTENDANCE ---------------- */}
      {tab === "attendance" && (
        <table border={1} cellPadding={8}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.status}</td>
                <td>{a.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
