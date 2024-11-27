import { combineReducers } from "redux";
import Auth from "./reducer/auth";
import institutionsReducer from "./reducer/institution";
import userReducer from "./reducer/user";
import programsReducer from "./reducer/program";
import semestersReducer from "./reducer/semester";
import coursesReducer from "./reducer/course";
import classesReducer from "./reducer/class";
import enrollmentsReducer from "./reducer/program_enrollment";
import classEnrollmentsReducer from "./reducer/class_enrollment";
import instructorClassesReducer from "./reducer/class_instructor";
import dashboardReducer from "./reducer/dashboard";
import Institution from "./pages/institution_page";
import institutionAdminReducer from "./reducer/institution_admin";

const rootReducer = combineReducers({
  auth: Auth,
  institutions: institutionsReducer,
  user: userReducer,
  users: userReducer,
  programs: programsReducer,
  semesters: semestersReducer,
  courses: coursesReducer,
  classes: classesReducer,
  enrollments: enrollmentsReducer,
  classEnrollments: classEnrollmentsReducer,
  instructorClasses: instructorClassesReducer,
  dashboard: dashboardReducer,
  institutionAdmins: institutionAdminReducer,
});

export default rootReducer;
