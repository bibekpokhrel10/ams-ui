import React from "react";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import { LoginPage } from "../pages/login_page";
import { Dashboard } from "../pages/dashboard";
import { PrimarySearchAppBar } from "../components/appbar/appbar";
import { RegisterPage } from "../pages/register_page";
import Institution from "../pages/institution_page";
import User from "../pages/user_page";
import ProgramPage from "../pages/program_page";
import SemesterPage from "../pages/semester_page";
import CoursePage from "../pages/course_page";
import ClassPage from "../pages/class_page";
import AttendancePage from "../pages/attendance_page";
import ProgramEnrollmentPage from "../pages/program_enrollment_page";
import ClassEnrollmentPage from "../pages/class_enrollment_page";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/register" element={<RegisterPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/users" element={<User />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/institutions" element={<Institution />} />
          <Route path="/institutions/:id/programs" element={<ProgramPage />} />
          <Route path="/programs/:id/semesters" element={<SemesterPage />} />
          <Route path="/semesters/:id/courses" element={<CoursePage />} />
          <Route path="/courses/:courseId/classes" element={<ClassPage />} />
          <Route path="/attendances" element={<AttendancePage />} />
          <Route path="/programs/:id/enrollments" element={<ProgramEnrollmentPage />} />
          <Route path="/classes/enrollment" element={<ClassEnrollmentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routing;
