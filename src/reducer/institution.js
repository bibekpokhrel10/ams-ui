import * as types from "../constant/actionTypes";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const institutionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_INSTITUTIONS_REQUEST:
    case types.CREATE_INSTITUTION_REQUEST:
    case types.DELETE_INSTITUTION_REQUEST:
      return { ...state, loading: true, error: null };

      case types.FETCH_INSTITUTIONS_SUCCESS:
        return {
          ...state,
          list: action.payload.data,
          loading: false,
          error: null
        };

      case types.CREATE_INSTITUTION_SUCCESS:
        return {
          ...state,
          list: [...(state.list || []), action.payload.data],
          loading: false,
          error: null
        };

    case types.DELETE_INSTITUTION_SUCCESS:
      return {
        ...state,
        list: state.list.filter(institution => institution.id !== action.payload),
        loading: false,
        error: null
      };

    case types.FETCH_INSTITUTIONS_FAILURE:
    case types.CREATE_INSTITUTION_FAILURE:
    case types.DELETE_INSTITUTION_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default institutionsReducer;