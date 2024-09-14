import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const programsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PROGRAMS_REQUEST:
    case types.CREATE_PROGRAM_REQUEST:
    case types.DELETE_PROGRAM_REQUEST:
      return { ...state, loading: true, error: null };

      case types.FETCH_PROGRAMS_SUCCESS:
        return {
          ...state,
          list: action.payload.data,
          loading: false,
          error: null
        };

      case types.CREATE_PROGRAM_SUCCESS:
        return {
          ...state,
          list: [...(state.list || []), action.payload.data],
          loading: false,
          error: null
        };

    case types.DELETE_PROGRAM_SUCCESS:
      return {
        ...state,
        list: state.list.filter(program => program.id !== action.payload),
        loading: false,
        error: null
      };

    case types.FETCH_PROGRAMS_FAILURE:
    case types.CREATE_PROGRAM_FAILURE:
    case types.DELETE_PROGRAM_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default programsReducer;