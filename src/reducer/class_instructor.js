import * as types from "../constant/actionTypes";


const initialState = {
    list: [],
    students: [],
    loading: false,
    studentsLoading: false,
    error: null,
    studentsError: null
  };
  
  const instructorClassesReducer = (state = initialState, action) => {
    switch (action.type) {
      case types.FETCH_INSTRUCTOR_CLASSES_REQUEST:
        return {
          ...state,
          loading: true,
          error: null
        };
  
      case types.FETCH_INSTRUCTOR_CLASSES_SUCCESS:
        return {
          ...state,
          list: action.payload.data,
          loading: false,
          error: null
        };
  
      case types.FETCH_INSTRUCTOR_CLASSES_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
  
      case types.FETCH_CLASS_STUDENTS_REQUEST:
        return {
          ...state,
          studentsLoading: true,
          studentsError: null
        };
  
      case types.FETCH_CLASS_STUDENTS_SUCCESS:
        return {
          ...state,
          students: action.payload.data,
          studentsLoading: false,
          studentsError: null
        };
  
      case types.FETCH_CLASS_STUDENTS_FAILURE:
        return {
          ...state,
          studentsLoading: false,
          studentsError: action.payload
        };
  
      default:
        return state;
    }
  };
  
  export default instructorClassesReducer;