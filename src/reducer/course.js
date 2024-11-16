import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const coursesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_COURSES_REQUEST:
    case types.CREATE_COURSE_REQUEST:
    case types.DELETE_COURSE_REQUEST:
      return { ...state, loading: true, error: null };
    case types.FETCH_COURSES_SUCCESS:
      return {
        ...state,
        list: action.payload.data,
        loading: false,
        error: null
      };
    case types.CREATE_COURSE_SUCCESS:
      return {
        ...state,
        list: [...(state.list || []), action.payload.data],
        loading: false,
        error: null
      };
    case types.DELETE_COURSE_SUCCESS:
      return {
        ...state,
        list: state.list.filter(course => course.id !== action.payload),
        loading: false,
        error: null
      };
    case types.UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        list: state.list.map(course =>
          course.id === action.payload.data.id ? action.payload.data : course
        ),
        loading: false,
        error: null
      };
    case types.FETCH_COURSES_FAILURE:
    case types.CREATE_COURSE_FAILURE:
    case types.DELETE_COURSE_FAILURE:
    case types.UPDATE_COURSE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default coursesReducer;