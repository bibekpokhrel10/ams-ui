import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  instructors: [],
  loading: false,
  error: null,
};

const classesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_CLASSES_REQUEST:
    case types.CREATE_CLASS_REQUEST:
    case types.DELETE_CLASS_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_CLASSES_SUCCESS:
      return {
        ...state,
        list: action.payload.data,
        loading: false,
        error: null
      };

    case types.FETCH_INSTRUCTORS_SUCCESS:
      return {
        ...state,
        instructors: action.payload.data,
        loading: false,
        error: null
      };

    case types.CREATE_CLASS_SUCCESS:
      return {
        ...state,
        list: [...(state.list || []), action.payload.data],
        loading: false,
        error: null
      };

    case types.DELETE_CLASS_SUCCESS:
      return {
        ...state,
        list: state.list.filter(classItem => classItem.id !== action.payload),
        loading: false,
        error: null
      };

    case types.UPDATE_CLASS_SUCCESS:
      return {
        ...state,
        list: state.list.map(classItem =>
          classItem.id === action.payload.data.id ? action.payload.data : classItem
        ),
        loading: false,
        error: null
      };

    case types.FETCH_CLASSES_FAILURE:
    case types.CREATE_CLASS_FAILURE:
    case types.DELETE_CLASS_FAILURE:
    case types.UPDATE_CLASS_FAILURE:
    case types.FETCH_INSTRUCTORS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default classesReducer;