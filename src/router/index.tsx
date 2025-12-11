import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage.tsx";
import RegisterPage from "../pages/Register/RegisterPage.tsx";

import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import ClassSubjectsPage from "../pages/Teacher/ClassSubjectsPage";
import SubjectPage from "../pages/Teacher/SubjectPage";
import StudentPage from "../pages/Teacher/StudentPage";
import HomeworkPage from "../pages/Teacher/HomeworkPage";
import StudentDashboardPage from "../pages/Student/StudentDashboard.tsx";
import StudentSubjectPage from "../pages/Student/StudentSubjectPage.tsx";


const router = createBrowserRouter([
    { path: "/", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/teacher", element: <TeacherDashboard /> },
    { path: "/admin", element: <div>Admin panel</div> },
    { path: "/teacher/class/:classId", element: <ClassSubjectsPage /> },
    {path: "/teacher/class/:classId/subject/:subjectId", element: <SubjectPage />},
    {path: "/teacher/class/:classId/subject/:subjectId/student/:studentId", element: <StudentPage />},
    {path: "/teacher/class/:classId/subject/:subjectId/homework", element: <HomeworkPage />},
    {path: "/student",element: <StudentDashboardPage />},
    {path: "/student/subject/:subjectId/class/:classId",element: <StudentSubjectPage />}
]);

export default router;
