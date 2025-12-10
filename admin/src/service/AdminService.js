import http from "./httpService";

const apiEndpoint = process.env.REACT_APP_API_URL || "http://localhost:5001";
const prefix = process.env.REACT_APP_ADMIN_PREFIX || "/admin";
const adminEndpoint = apiEndpoint + prefix;

async function login({ email, password }) {
  const config = { headers: { "Content-Type": "application/json" } };

  return http.post(
    adminEndpoint + "/login",
    {
      email,
      password,
    },
    config
  );
}

export function getJwt() {
  return localStorage.getItem("token");
}

function setUpAuth() {
  http.setJwt(getJwt());
}
setUpAuth();

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

async function getCourseList() {
  return http.get(adminEndpoint + `/courses`);
}

function editCourse(courseId, body) {
  return http.put(`${adminEndpoint}/courses/${courseId}`, body);
}

async function deleteCourse(courseId) {
  return http.delete(`${apiEndpoint}/course/${courseId}`);
}

async function getUserList() {
  return http.get(`${adminEndpoint}/users`);
}

function getAdmin() {
  return http.get(`${apiEndpoint}/user/profile`);
}

function editUser(userId, body) {
  return http.put(`${adminEndpoint}/users/${userId}`, body);
}

function editRole(userId, body) {
  return http.put(`${adminEndpoint}/users/role/${userId}`, body);
}

function deleteUser(userId) {
  return http.delete(`${adminEndpoint}/users/${userId}`);
}

function getStatistic() {
  return http.get(adminEndpoint + `/`);
}

function setInstructor(userId) {
  const config = { headers: { "Content-Type": "multipart/form-data" } };
  return http.put(apiEndpoint + `/setInstructor/${userId}`, config);
}

export default {
  login,
  logout,
  getUserList,
  getCourseList,
  getJwt,
  getAdmin,
  setInstructor,
  deleteCourse,
  deleteUser,
  editCourse,
  getStatistic,
  setUpAuth,
  editUser,
  editRole,
  deleteCourse,
};
