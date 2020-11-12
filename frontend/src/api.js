import Axios from "axios";

export const loginAPI = (APIlocation) => (login) =>
  Axios.post(`${APIlocation}/login`, login);

export const postAPI = (APIlocation) => (post) =>
  Axios.post(`${APIlocation}/posts/`, post);
