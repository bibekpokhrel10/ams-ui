import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
  enrolledStudents: [],
};

const enrollmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_ENROLLED_STUDENTS_REQUEST:
    case types.ENROLL_STUDENTS_REQUEST:
    case types.UNENROLL_STUDENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_ENROLLED_STUDENTS_SUCCESS:
      return {
        ...state,
        list: action.payload.list || [],
        total: action.payload.total,
        loading: false,
        error: null,
        // Remove enrolledStudents since it's redundant with list
      };

    case types.ENROLL_STUDENTS_SUCCESS:
      // You might want to update the list here with the newly enrolled students
      return {
        ...state,
        loading: false,
        error: null,
        // Optionally update list if you have the new data
        // list: [...state.list, ...action.payload]
      };

    case types.UNENROLL_STUDENT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(student => student.id !== action.payload),
        total: state.total - 1,
        loading: false,
        error: null,
      };

    case types.FETCH_ENROLLED_STUDENTS_FAILURE:
    case types.ENROLL_STUDENTS_FAILURE:
    case types.UNENROLL_STUDENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default enrollmentsReducer;