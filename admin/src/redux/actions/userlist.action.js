import AdminService from "../../service/AdminService";
import { SET_USER_LIST, SET_NOTIFICATION, SET_USER_EDIT } from "../type";

export const doGetUserList = () => async (dispatch) => {
  await AdminService.getUserList()
    .then((res) => {
      let users = res.data;

      dispatch({ type: SET_USER_LIST, users: [...users] });
    })
    .catch(() => {
      // window.location = "/admin/auth";
      let notification = {
        type: "warning",
        title: "Thông báo!",
        description: "get users thất bại!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    });
};

export const doEditUserList = (userId, body) => async (dispatch) => {
  await AdminService.editUser(userId, body)
    .then((res) => {
      let notification = {
        type: "success",
        title: "Thông báo!",
        description: "Cập nhật thành công!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
      dispatch({ type: SET_USER_EDIT, userId, body });
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

export const doUpdateRole = (userId, role) => async (dispatch) => {
  await AdminService.editRole(userId, { role })
    .then((res) => {
      let notification = {
        type: "success",
        title: "Thông báo!",
        description: "Cập nhật thành công!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
      dispatch({ type: SET_USER_EDIT, userId, body: { role } });
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

export const doDeleteUser = (userId) => async (dispatch) => {
  await AdminService.deleteUser(userId)
    .then((res) => {
      let notification = {
        type: "success",
        title: "Thông báo!",
        description: "Xóa thành công!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    })
    .catch(() => {
      let notification = {
        type: "warning",
        title: "Thông báo!",
        description: "Xóa thất bại!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    });
};
