import AdminService from "../../service/AdminService";
import { SET_ERROR, SET_TOKEN, SET_USER, SET_NOTIFICATION } from "../type";
import http from "../../service/httpService";

export const doLogin = (email, password) => async (dispatch) => {
  try {
    AdminService.login({ email, password })
      .then((data) => {
        const { accessToken, user } = data.data;

        dispatch({ type: SET_TOKEN, token: accessToken });
        dispatch({ type: SET_USER, user: user });
        dispatch({
          type: SET_ERROR,
          error: {
            status: false,
            message: "",
          },
        });
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", user);
        http.setJwt(accessToken);
        window.location = "/";
      })
      .catch((error) => {
        dispatch({
          type: SET_ERROR,
          error: {
            status: true,
            message: error.response?.data?.message,
          },
        });
      });
  } catch ({ message }) {}
};

export const getUserProfile = () => async (dispatch) => {
  try {
    await AdminService.getAdmin()
      .then((res) => {
        let user = res.data;
        dispatch({ type: SET_USER, user: user });
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: SET_USER, user: user });
        let notification = {
          type: "success",
          title: "Thông báo!",
          description: "Đăng nhập thành công!",
        };
        dispatch({ type: SET_NOTIFICATION, notification });
      })
      .catch(() => {
        // window.location = "/admin/auth";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  } catch ({ message }) {}
};
