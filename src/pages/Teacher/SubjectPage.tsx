import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/api";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function SubjectPage() {
  const { classId, subjectId } = useParams();

  const [students, setStudents] = useState<Student[]>([]);
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Load class name
        const classRes = await api.get(`/classes/${classId}/info`);
        setClassName(classRes.data.name);

        // Load subject name
        const subjRes = await api.get(`/subjects/${subjectId}/info`);
        setSubjectName(subjRes.data.name);

        // Load students
        const studRes = await api.get(`/classes/${classId}/students`);
        setStudents(studRes.data);

      } catch (e) {
        console.error("Failed to load subject page", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [classId, subjectId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Class {className} – Subject {subjectName}
      </h2>

      <h3>Students</h3>

      {students.length === 0 && <p>No students in this class.</p>}

      <ul>
        {students.map(s => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            <Link to={`/teacher/class/${classId}/subject/${subjectId}/student/${s.id}`}>
              {s.firstName} {s.lastName}
            </Link>
          </li>
        ))}
      </ul>

      <hr />

      <Link to={`/teacher/class/${classId}/subject/${subjectId}/homework`}>
        View Homework
      </Link>
    </div>
  );
}
