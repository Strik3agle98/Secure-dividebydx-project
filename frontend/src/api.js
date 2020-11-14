import Axios from "axios";

export const loginAPI = (APIlocation) => (login) =>
  Axios.post(`${APIlocation}/login`, login);

export const whoamiAPI = (APIlocation) => Axios.get(`${APIlocation}/user/me`);

export const getPostAPI = (APIlocation) => Axios.get(`${APIlocation}/posts/`);

export const postAPI = (APIlocation) => (post) =>
  Axios.post(`${APIlocation}/posts/`, post);
