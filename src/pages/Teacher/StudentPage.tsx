import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

type Grade = {
  id: number;
  studentId: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  score: number;
  type: string;
  comment: string;
  date: string;
};

type Attendance = {
  id: number;
  studentId: number;
  classId: number;
  subjectId: number;
  date: string;
  status: string;
  reason: string;
};

type StudentInfo = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export default function StudentPage() {
  const { classId, subjectId, studentId } = useParams();

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  const [tab, setTab] = useState<"grades" | "attendance">("grades");

  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  // Grade form
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [gradeScore, setGradeScore] = useState(10);
  const [gradeType, setGradeType] = useState("Current");
  const [gradeComment, setGradeComment] = useState("");
  const [gradeDate, setGradeDate] = useState("");

  // Attendance form
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [attStatus, setAttStatus] = useState("Present");
  const [attReason, setAttReason] = useState("");
  const [attDate, setAttDate] = useState("");

  useEffect(() => {
    loadStudent();
    loadData();
  }, [studentId, subjectId]);

  const loadStudent = async () => {
    const res = await api.get(`/users/${studentId}`);
    setStudentInfo(res.data);
  };

  const loadData = async () => {
    setLoading(true);

    const gradesRes = await api.get(`/grades/student/${studentId}/subject/${subjectId}`);
    const attRes = await api.get(`/attendance/student/${studentId}/subject/${subjectId}`);

    setGrades(
      gradesRes.data.sort((a: Grade, b: Grade) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );

    setAttendance(
      attRes.data.sort((a: Attendance, b: Attendance) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );

    setLoading(false);
  };

  const saveGrade = async () => {
    if (editingGrade) {
      await api.put(`/grades/${editingGrade.id}`, {
        ...editingGrade,
        score: gradeScore,
        type: gradeType,
        comment: gradeComment,
        date: gradeDate,
      });
    } else {
      await api.post("/grades", {
        studentId: Number(studentId),
        classId: Number(classId),
        subjectId: Number(subjectId),
        teacherId: Number(localStorage.getItem("userId")),
        score: gradeScore,
        type: gradeType,
        comment: gradeComment,
        date: gradeDate || new Date().toISOString(),
      });
    }

    resetGradeForm();
    loadData();
  };

  const deleteGrade = async (id: number) => {
    await api.delete(`/grades/${id}`);
    loadData();
  };

  const resetGradeForm = () => {
    setEditingGrade(null);
    setGradeScore(10);
    setGradeType("Current");
    setGradeComment("");
    setGradeDate("");
  };

  const saveAttendance = async () => {
    if (editingAttendance) {
      await api.put(`/attendance/${editingAttendance.id}`, {
        ...editingAttendance,
        status: attStatus,
        reason: attReason,
        date: attDate,
      });
    } else {
      await api.post("/attendance", {
        studentId: Number(studentId),
        classId: Number(classId),
        subjectId: Number(subjectId),
        status: attStatus,
        reason: attReason,
        date: attDate || new Date().toISOString(),
      });
    }

    resetAttendanceForm();
    loadData();
  };

  const deleteAttendanceEntry = async (id: number) => {
    await api.delete(`/attendance/${id}`);
    loadData();
  };

  const resetAttendanceForm = () => {
    setEditingAttendance(null);
    setAttStatus("Present");
    setAttReason("");
    setAttDate("");
  };

  if (loading || !studentInfo) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 850 }}>
      <h2>
        {studentInfo.firstName} {studentInfo.lastName}
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <button onClick={() => setTab("grades")} style={{ fontWeight: tab === "grades" ? "bold" : "normal" }}>
          Grades
        </button>

        <button
          onClick={() => setTab("attendance")}
          style={{ fontWeight: tab === "attendance" ? "bold" : "normal" }}
        >
          Attendance
        </button>
      </div>

      {/* ----------------- GRADES TAB ----------------- */}
      {tab === "grades" && (
        <div>
          <h3>Grades</h3>

          <table border={1} cellPadding={8} style={{ marginBottom: 20 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Score</th>
                <th>Type</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {grades.map((g) => (
                <tr key={g.id}>
                  <td>{new Date(g.date).toLocaleDateString()}</td>
                  <td>{g.score}</td>
                  <td>{g.type}</td>
                  <td>{g.comment}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingGrade(g);
                        setGradeScore(g.score);
                        setGradeType(g.type);
                        setGradeComment(g.comment);
                        setGradeDate(g.date.substring(0, 10));
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteGrade(g.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Grade form */}
          <div>
            <h4>{editingGrade ? "Edit Grade" : "Add Grade"}</h4>

            <label>
              Score:
              <input type="number" value={gradeScore} onChange={(e) => setGradeScore(Number(e.target.value))} />
            </label>

            <label>
              Type:
              <select value={gradeType} onChange={(e) => setGradeType(e.target.value)}>
                <option value="Current">Current</option>
                <option value="Thematic">Thematic</option>
                <option value="Semester">Semester</option>
                <option value="Yearly">Yearly</option>
              </select>
            </label>

            <label>
              Comment:
              <input value={gradeComment} onChange={(e) => setGradeComment(e.target.value)} />
            </label>

            <label>
              Date:
              <input type="date" value={gradeDate} onChange={(e) => setGradeDate(e.target.value)} />
            </label>

            <button onClick={saveGrade}>Save</button>
          </div>
        </div>
      )}

      {/* ----------------- ATTENDANCE TAB ----------------- */}
      {tab === "attendance" && (
        <div>
          <h3>Attendance</h3>

          <table border={1} cellPadding={8} style={{ marginBottom: 20 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.status}</td>
                  <td>{a.reason}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingAttendance(a);
                        setAttStatus(a.status);
                        setAttReason(a.reason);
                        setAttDate(a.date.substring(0, 10));
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteAttendanceEntry(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Attendance form */}
          <div>
            <h4>{editingAttendance ? "Edit Attendance" : "Add Attendance"}</h4>

            <label>
              Status:
              <select value={attStatus} onChange={(e) => setAttStatus(e.target.value)}>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
                <option>Excused</option>
              </select>
            </label>

            <label>
              Reason:
              <input value={attReason} onChange={(e) => setAttReason(e.target.value)} />
            </label>

            <label>
              Date:
              <input type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} />
            </label>

            <button onClick={saveAttendance}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
