import * as types from "../constant/actionTypes";

const initialState = {
  data: {
    superAdmin: {
      stats: {},
      institutionsList: []
    },
    institutionAdmin: {
      stats: {},
      attendanceTrends: []
    },
    programAdmin: {
      stats: {},
      semesterData: []
    },
    teacher: {
      stats: {},
      classes: []
    },
    student: {
      stats: {},
      courses: []
    }
  },
  loading: false,
  error: null
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case types.FETCH_DASHBOARD_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null
      };

    case types.FETCH_DASHBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default dashboardReducer;