import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
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

type HighlightState = {
  highlight?: {
    type: "Grade" | "Homework";
    entityId: number;
  };
};

export default function StudentSubjectPage() {
  const { classId, subjectId } = useParams();
  const location = useLocation() as { state?: HighlightState };

  const studentId = Number(localStorage.getItem("userId"));

const highlight = location.state?.highlight;

const [tab, setTab] = useState<"grades" | "homework" | "attendance">(
  highlight?.type === "Homework"
    ? "homework"
    : highlight?.type === "Grade"
    ? "grades"
    : "grades"
);


  const [grades, setGrades] = useState<Grade[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const [subjectName, setSubjectName] = useState("");
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      if (!classId || !subjectId) return;
      setLoading(true);

      try {
        const [subjRes, classRes, gradesRes, hwRes, attRes] = await Promise.all([
          api.get(`/subjects/${subjectId}/info`),
          api.get(`/classes/${classId}/info`),
          api.get(`/grades/student/${studentId}/subject/${subjectId}`),
          api.get(`/homework/class/${classId}/subject/${subjectId}`),
          api.get(`/attendance/student/${studentId}/subject/${subjectId}`)
        ]);

        setSubjectName(subjRes.data.name);
        setClassName(classRes.data.name);

        setGrades(
          gradesRes.data.sort(
            (a: Grade, b: Grade) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );

        setHomework(
          hwRes.data.sort(
            (a: Homework, b: Homework) =>
              new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
          )
        );

        setAttendance(
          attRes.data.sort(
            (a: Attendance, b: Attendance) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (e) {
        console.error("Failed to load student subject page", e);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [classId, subjectId, studentId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {subjectName} – {className}
      </h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <button
          onClick={() => setTab("grades")}
          style={{ fontWeight: tab === "grades" ? "bold" : "normal" }}
        >
          Grades
        </button>
        <button
          onClick={() => setTab("homework")}
          style={{ fontWeight: tab === "homework" ? "bold" : "normal" }}
        >
          Homework
        </button>
        <button
          onClick={() => setTab("attendance")}
          style={{ fontWeight: tab === "attendance" ? "bold" : "normal" }}
        >
          Attendance
        </button>
      </div>

      {tab === "grades" && (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Score</th>
              <th>Type</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr
                key={g.id}
                style={{
                  backgroundColor:
                    location.state?.highlight?.type === "Grade" &&
                    location.state.highlight.entityId === g.id
                      ? "#d1ecf1"
                      : "transparent"
                }}
              >
                <td>{new Date(g.date).toLocaleDateString()}</td>
                <td>{g.score}</td>
                <td>{g.type}</td>
                <td>{g.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "homework" && (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Created</th>
              <th>Due</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {homework.map(hw => (
              <tr
                key={hw.id}
                style={{
                  backgroundColor:
                    location.state?.highlight?.type === "Homework" &&
                    location.state.highlight.entityId === hw.id
                      ? "#fff3cd"
                      : "transparent"
                }}
              >
                <td>{new Date(hw.createdAt).toLocaleDateString()}</td>
                <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
                <td>{hw.title}</td>
                <td>{hw.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "attendance" && (
        <table border={1} cellPadding={8} style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(a => (
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
