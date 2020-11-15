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

export const getCommentAPI = (APIlocation) => (id) => (token) =>
  Axios.get(`${APIlocation}/api/post/${id}/comment`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const postAPI = (APIlocation) => (post) => (token) =>
  Axios.post(`${APIlocation}/api/post/`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const commentAPI = (APIlocation) => (id) => (post) => (token) =>
  Axios.post(`${APIlocation}/api/post/${id}/comment`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAPI = (APIlocation) => (id) => (token) =>
  Axios.delete(`${APIlocation}/api/post/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const editAPI = (APIlocation) => (id) => (post) => (token) =>
  Axios.post(`${APIlocation}/api/post/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const editCommentAPI = (APIlocation) => (id) => (post) => (token) =>
  Axios.post(`${APIlocation}/api/comment/${id}`, post, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteCommentAPI = (APIlocation) => (id) => (token) =>
  Axios.delete(`${APIlocation}/api/comment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
