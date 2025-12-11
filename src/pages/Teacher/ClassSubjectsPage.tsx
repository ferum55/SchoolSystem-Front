import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

type SubjectItem = {
  id: number;
  name: string;
  description: string;
};

export default function ClassSubjectsPage() {
  const { classId } = useParams();
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) load class info for name
        const classRes = await api.get(`/classes/${classId}/info`);
        setClassName(classRes.data.name);

        // 2) load subjects
        const subjRes = await api.get(`/classes/${classId}/subjects`);
        setSubjects(subjRes.data);
      } catch (e) {
        console.error("Failed to load subjects:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Subjects in Class {className}</h2>

      {subjects.length === 0 && <p>No subjects assigned.</p>}

      <ul>
        {subjects.map((s) => (
          <li key={s.id} style={{ marginBottom: 10 }}>
            <Link to={`/teacher/class/${classId}/subject/${s.id}`}>
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
