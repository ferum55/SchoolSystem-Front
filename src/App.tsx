import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage.tsx";
import RegisterPage from "./pages/Register/RegisterPage.tsx";
import TeacherDashboardPage from "./pages/Teacher/TeacherDashboard";
import ClassSubjectsPage from "./pages/Teacher/ClassSubjectsPage";



function StudentPage() {
  return <h1>Student Dashboard</h1>;
}

function TeacherPage() {
  return <h1>Teacher Dashboard</h1>;
}

function AdminPage() {
  return <h1>Admin Dashboard</h1>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherDashboardPage />} />
        <Route path="/teacher/class/:classId" element={<ClassSubjectsPage />}
/>
      </Routes>
    </Router>
  );
}

export default App;
