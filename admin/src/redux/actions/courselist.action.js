import AdminService from "../../service/AdminService";
import {
  SET_COURSE_LIST,
  SET_NOTIFICATION,
  SET_COURSE_EDIT,
  SET_COURSE_DELETE,
} from "../type";

export const doGetCourseList = () => async (dispatch) => {
  await AdminService.getCourseList()
    .then((res) => {
      let courses = res.data;
      dispatch({ type: SET_COURSE_LIST, courses: [...courses] });
    })
    .catch(() => {
      let notification = {
        type: "warning",
        title: "Thông báo!",
        description: "Cập nhật thất bại!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    });
};

export const doEditCourseList = (courseId, body) => async (dispatch) => {
  await AdminService.editCourse(courseId, body)
    .then((res) => {
      let notification = {
        type: "success",
        title: "Thông báo!",
        description: "Cập nhật thành công!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
      dispatch({ type: SET_COURSE_EDIT, courseId, body });
    })
    .catch(() => {
      let notification = {
        type: "warning",
        title: "Thông báo!",
        description: "Cập nhật thất bại!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    });
};

export const doDeleteCourse = (courseId) => async (dispatch) => {
  await AdminService.deleteCourse(courseId)
    .then((res) => {
      let notification = {
        type: "success",
        title: "Thông báo!",
        description: "Cập nhật thành công!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    })
    .catch(() => {
      let notification = {
        type: "warning",
        title: "Thông báo!",
        description: "Cập nhật thất bại!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    });
};
