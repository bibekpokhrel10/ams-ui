import * as types from '../constant/actionTypes';

const initialState = {
  admins: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10
  }
};

const institutionAdminReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_INSTITUTION_ADMINS_REQUEST:
    case types.ADD_INSTITUTION_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.FETCH_INSTITUTION_ADMINS_SUCCESS:
      return {
        ...state,
        loading: false,
        admins: action.payload.data,
        pagination: {
          total: action.payload.count,
          page: action.payload.page,
          size: action.payload.size
        }
      };

    case types.ADD_INSTITUTION_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        admins: [...state.admins, action.payload]
      };

    case types.FETCH_INSTITUTION_ADMINS_FAILURE:
    case types.ADD_INSTITUTION_ADMIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default institutionAdminReducer;