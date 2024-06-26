import axios from "axios";

export const userLogin = (loginUserPayload) => {
  const loginUser = axios.post(`${process.env.REACT_APP_API}/users/login`, loginUserPayload);
  return loginUser;
};

export const registerUser = (registerUserPayload) => {
  const registerUser = axios.post(`${process.env.REACT_APP_API}/users/register`, registerUserPayload);
  return registerUser;
};
