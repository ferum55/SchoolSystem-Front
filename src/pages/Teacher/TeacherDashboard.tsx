import { useEffect, useState } from "react";
import api from "../../api/api";

type ClassItem = {
  id: number;
  name: string;
  year: number;
};

export default function TeacherDashboardPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const teacherName = localStorage.getItem("name") || "Teacher";
  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchClasses = async () => {
      if (!teacherId) {
        console.error("No teacher ID found");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/classes/teacher/${teacherId}`);
        setClasses(res.data);
      } catch (err) {
        console.error("Error loading teacher classes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [teacherId]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {teacherName}</h2>
      <h3>Your Classes</h3>

      {classes.length === 0 && <p>No classes found.</p>}

      <ul>
        {classes.map((c) => (
          <li key={c.id} style={{ marginBottom: 10 }}>
            <a
              href={`/teacher/class/${c.id}`}
              style={{ fontSize: 18, textDecoration: "underline" }}
            >
              {c.name} ({c.year})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
