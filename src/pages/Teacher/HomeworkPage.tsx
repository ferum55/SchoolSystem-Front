import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

type Homework = {
  id: number;
  classId: number;
  subjectId: number;
  teacherId: number;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
};

export default function HomeworkPage() {
  const { classId, subjectId } = useParams();

  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);

  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  // Form state
  const [editing, setEditing] = useState<Homework | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");

  useEffect(() => {
    loadNames();
    loadHomework();
  }, [classId, subjectId]);

  const loadNames = async () => {
    // Load class name
    const cls = await api.get(`/classes/${classId}`);
    setClassName(`${cls.data.name}`);

    // Load subject name
    const subj = await api.get(`/subjects/${subjectId}/info`);
    setSubjectName(subj.data.name);
  };

  const loadHomework = async () => {
    setLoading(true);

    const res = await api.get(`/homework/class/${classId}/subject/${subjectId}`);

    setHomework(
      res.data.sort(
        (a: Homework, b: Homework) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    );

    setLoading(false);
  };

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setDesc("");
    setDue("");
  };

  const saveHomework = async () => {
    const payload = {
      classId: Number(classId),
      subjectId: Number(subjectId),
      teacherId: Number(localStorage.getItem("userId")),
      title,
      description: desc,
      dueDate: due,
    };

    if (editing) {
      await api.put(`/homework/${editing.id}`, {
        ...editing,
        title,
        description: desc,
        dueDate: due,
      });
    } else {
      await api.post("/homework", payload);
    }

    resetForm();
    loadHomework();
  };

  const deleteHomework = async (id: number) => {
    await api.delete(`/homework/${id}`);
    loadHomework();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 850 }}>
      <h2>
        Homework for {className} – {subjectName}
      </h2>

      <h3>Homework List</h3>

      <table border={1} cellPadding={8} style={{ marginBottom: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {homework.map((hw) => (
            <tr key={hw.id}>
              <td>{hw.title}</td>
              <td>{hw.description}</td>
              <td>{new Date(hw.createdAt).toLocaleDateString()}</td>
              <td>{new Date(hw.dueDate).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => {
                    setEditing(hw);
                    setTitle(hw.title);
                    setDesc(hw.description);
                    setDue(hw.dueDate.substring(0, 10));
                  }}
                >
                  Edit
                </button>

                <button onClick={() => deleteHomework(hw.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>{editing ? "Edit Homework" : "Add Homework"}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
        <label>
          Title:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description:
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>

        <label>
          Due Date:
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>

        <button onClick={saveHomework}>Save</button>
        {editing && <button onClick={resetForm}>Cancel</button>}
      </div>
    </div>
  );
}
