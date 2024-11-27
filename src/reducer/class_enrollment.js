import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  total: 0,
  loading: false,
  error: null,
};

const classEnrollmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CLASS_ENROLLED_STUDENTS_REQUEST:
    case types.ENROLL_CLASS_STUDENTS_REQUEST:
    case types.UNENROLL_CLASS_STUDENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_CLASS_ENROLLED_STUDENTS_SUCCESS:
      return {
        ...state,
        list: action.payload.list || [],
        total: action.payload.total,
        loading: false,
        error: null,
      };

    case types.ENROLL_CLASS_STUDENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case types.UNENROLL_CLASS_STUDENT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(student => student.id !== action.payload),
        total: state.total - 1,
        loading: false,
        error: null,
      };

    case types.FETCH_CLASS_ENROLLED_STUDENTS_FAILURE:
    case types.ENROLL_CLASS_STUDENTS_FAILURE:
    case types.UNENROLL_CLASS_STUDENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default classEnrollmentsReducer;