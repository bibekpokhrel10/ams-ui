import * as types from "../constant/actionTypes";
import { getNotifications, markNotificationAsRead } from "../services/apiCall";


export const fetchNotifications = () => async (dispatch, getState) => {
    try {
      dispatch({ type: types.FETCH_NOTIFICATIONS_REQUEST });
      const token = getState().auth.token;
      const response = await getNotifications(token);
      dispatch({ type: types.FETCH_NOTIFICATIONS_SUCCESS, payload: response.data });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      dispatch({ type: types.FETCH_NOTIFICATIONS_FAILURE, payload: error.message });
    }
  };
  
  export const readNotification = (notificationId) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.READ_NOTIFICATION_REQUEST });
      const token = getState().auth.token;
      await markNotificationAsRead(notificationId, token);
      dispatch({ type: types.READ_NOTIFICATION_SUCCESS, payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      dispatch({ type: types.READ_NOTIFICATION_FAILURE, payload: error.message });
    }
  };