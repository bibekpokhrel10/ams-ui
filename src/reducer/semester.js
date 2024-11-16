import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const semestersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_SEMESTERS_REQUEST:
    case types.CREATE_SEMESTER_REQUEST:
    case types.DELETE_SEMESTER_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_SEMESTERS_SUCCESS:
      return {
        ...state,
        list: action.payload.data,
        loading: false,
        error: null
      };

    case types.CREATE_SEMESTER_SUCCESS:
      return {
        ...state,
        list: [...(state.list || []), action.payload.data],
        loading: false,
        error: null
      };

    case types.DELETE_SEMESTER_SUCCESS:
      return {
        ...state,
        list: state.list.filter(semester => semester.id !== action.payload),
        loading: false,
        error: null
      };

    case types.UPDATE_SEMESTER_SUCCESS:
      return {
        ...state,
        list: state.list.map(semester => 
          semester.id === action.payload.data.id ? action.payload.data : semester
        ),
        loading: false,
        error: null
      };

    case types.FETCH_SEMESTERS_FAILURE:
    case types.CREATE_SEMESTER_FAILURE:
    case types.DELETE_SEMESTER_FAILURE:
    case types.UPDATE_SEMESTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default semestersReducer;