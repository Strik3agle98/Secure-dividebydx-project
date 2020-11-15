import Axios from "axios";

export const loginAPI = (APIlocation) => (login) =>
  Axios.post(`${APIlocation}/api/login`, login);

export const registerAPI = (APIlocation) => (register) =>
  Axios.post(`${APIlocation}/api/dev/register`, register);

export const whoamiAPI = (APIlocation) => Axios.get(`${APIlocation}/user/me`);

export const getUserAPI = (APIlocation) => (id) => (token) =>
  Axios.get(`${APIlocation}/api/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPostAPI = (APIlocation) => (token) =>
  Axios.get(`${APIlocation}/api/post`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const postAPI = (APIlocation) => (post) =>
  Axios.post(`${APIlocation}/posts/`, post);
