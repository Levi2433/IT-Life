import "./App.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Registration from "./pages/Registration";
import About from "./pages/About";
import Landing from "./pages/Landing";
import Cards from "./pages/Cards";
import Add from "./pages/Add";
import TeacherLogin from "./pages/TeacherLogin";
import Contact from "./pages/Contact";
import StudentLogin from "./pages/StudentLogin";
import MentorPic from "./pages/MentorPic";
import Comments from "./pages/Comments";
import AllCourses from "./pages/AllCourses";
import CourseDetail from "./pages/CourseDetail";
import PayModal from "./pages/PayModal";
import AdminLogin from "./pages/AdminLogin";
import AdminLanding from "./pages/AdminLanding";
import RoleNavbar from "./components/Navbar/RoleNavbar";
import Sidebar from "./components/Sidebar/Sidebar";
import UsersTable from  "./components/UsersTable/UsersTable";

const MainLayout = () => (
  <>
    <Navbar />
    <Outlet />
    <Footer />
  </>
);

const AdminLayout = () => {
  if (!localStorage.getItem("token")) return <Navigate to="/admin-login" replace />;

  return (
    <div style={{ display: "flex", background: "#f0f1f3", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0 }}>
        <RoleNavbar />
        <main style={{ padding: "0 20px 20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route
        path="/"
        element={
          <>
            <Landing />
            <Cards />
            <Add />
            <MentorPic />
            <Comments />
          </>
        }
      />
    </Route>

    <Route path="/registration" element={<Registration />} />
    <Route path="/login" element={<Login />} />
    <Route path="/teacher-login" element={<TeacherLogin />} />
    <Route path="/student-login" element={<StudentLogin />} />
    <Route path="/about" element={<About />} />
    <Route path="/all-courses" element={<AllCourses />} />
    <Route path="/course-detail/:id" element={<CourseDetail />} />
    <Route path="/landing" element={<Landing />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/pay-modal" element={<PayModal />} />
    <Route path="/admin-login" element={<AdminLogin />} />

    <Route path="/admin-landing" element={<AdminLayout />}>
      <Route index element={<AdminLanding />} />
      <Route
        path="administrators"
        element={<UsersTable title="Administratorlar" url="/admin/all" role="Administrator" />}
      />
      <Route
        path="teachers"
        element={<UsersTable title="Mentorlar" url="/teachers" role="Mentor" remove="/admin/teachers" />}
      />
      <Route
        path="students"
        element={<UsersTable title="O'quvchilar" url="/students" role="O'quvchi" />}
      />
    </Route>
  </Routes>
);

export default App;