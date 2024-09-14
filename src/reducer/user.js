import * as types from "../constant/actionTypes";

const initialState = {
  profile: {},
  notifications: [],
  users: [],
  user: {},
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_USER_PROFILE_REQUEST:
    case types.FETCH_USER_PROFILE_REQUEST:
    case types.FETCH_NOTIFICATIONS_REQUEST:
    case types.READ_NOTIFICATION_REQUEST:
    case types.FETCH_USERS_REQUEST:
    case types.UPDATE_USER_STATUS_REQUEST:
      return { ...state, loading: true, error: null };

    case types.FETCH_USER_PROFILE_SUCCESS:
      return { ...state, loading: false, profile: action.payload.data };

    case types.FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications: action.payload };

    case types.READ_NOTIFICATION_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };

    case types.FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload.data };

      case types.UPDATE_USER_PROFILE_SUCCESS:
        return {
          ...state,
          loading: false,
          user: action.payload,
          users: state.users.map(user =>
            user.id === action.payload.id ? { ...user, ...action.payload } : user
          )
        };

    case types.UPDATE_USER_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, is_active: action.payload.is_active } : user
        ),
      };

    case types.UPDATE_USER_PROFILE_FAILURE:
    case types.FETCH_USERS_FAILURE:
    case types.FETCH_USER_PROFILE_FAILURE:
    case types.FETCH_NOTIFICATIONS_FAILURE:
    case types.READ_NOTIFICATION_FAILURE:
    case types.UPDATE_USER_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case types.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default userReducer;