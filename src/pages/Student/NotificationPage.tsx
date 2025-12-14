import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

type Notification = {
  id: number;
  type: "Grade" | "Homework";
  title: string;
  message: string;
  classId: number;
  subjectId: number;
  entityId: number;
  createdAt: string;
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("userId"));

  const [items, setItems] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = 10;

  useEffect(() => {
    load();
  }, [page]);

  const load = async () => {
    const res = await api.get(
      `/notifications/user/${userId}?page=${page}&pageSize=${pageSize}`
    );

    setItems(res.data.items);
    setTotal(res.data.total);
  };

  const onClick = async (n: Notification) => {
    await api.put(`/notifications/${n.id}/read`);

    navigate(
      `/student/subject/${n.subjectId}/class/${n.classId}`,
      {
        state: {
          highlight: {
            type: n.type,
            entityId: n.entityId
          }
        }
      }
    );
  };

  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h2>Notifications</h2>

      {items.length === 0 && <p>No unread notifications</p>}

      {items.map(n => (
        <div
          key={n.id}
          onClick={() => onClick(n)}
          style={{
            padding: 12,
            borderBottom: "1px solid #ddd",
            cursor: "pointer",
            background: "#fafafa"
          }}
        >
          <strong>{n.title}</strong>
          <div>{n.message}</div>
          <small>{new Date(n.createdAt).toLocaleString()}</small>
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page}
        </span>

        <button
          disabled={page * pageSize >= total}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
