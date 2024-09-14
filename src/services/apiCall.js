import axios from "axios";

export const userLogin = (loginUserPayload) => {
  const loginUser = axios.post(`${process.env.REACT_APP_API}/login`, loginUserPayload);
  return loginUser;
};

export const registerUser = (registerUserPayload) => {
  const registerUser = axios.post(`${process.env.REACT_APP_API}/register`, registerUserPayload);
  return registerUser;
};

export const getAttendance = (token) => {
  const attendanceUser = axios.get(`${process.env.REACT_APP_API}/attendances`, {headers: {"Authorization": `bearer ${token}`}});
  return attendanceUser;
};

export const getInstitutions = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/institutions`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createInstution = (institutionData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/institutions`, institutionData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteInstution = (institutionId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/institutions/${institutionId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getUserProfileAPI = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/users/profile`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getNotifications = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/notifications`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const markNotificationAsRead = (notificationId, token) => {
  return axios.put(`${process.env.REACT_APP_API}/notifications/${notificationId}`, {}, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getUsersAPI = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/users`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateUserPasswordAPI = (userId ,updateUserPasswordPayload, token) => {
  return axios.put(`${process.env.REACT_APP_API}/users/${userId}/change-password`, updateUserPasswordPayload, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateUserprofileAPI = (userId, updateUserprofilePayload, token) => {
  return axios.put(`${process.env.REACT_APP_API}/users/${userId}/activate`, updateUserprofilePayload, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const createProgramAPI = (programData, token) => {
  return axios.post(`${process.env.REACT_APP_API}/programs`, programData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const getProgramsAPI = (token) => {
  return axios.get(`${process.env.REACT_APP_API}/programs`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const updateProgramAPI = (programId, programData, token) => {
  return axios.put(`${process.env.REACT_APP_API}/programs/${programId}`, programData, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}

export const deleteProgramAPI = (programId, token) => {
  return axios.delete(`${process.env.REACT_APP_API}/programs/${programId}`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
}