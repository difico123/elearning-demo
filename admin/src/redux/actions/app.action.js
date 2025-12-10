import { SET_NOTIFICATION, SET_OVERVIEW_DATA } from "../type";
import AdminService from "../../service/AdminService";
export const setNotification =
  (type, title, description) => async (dispatch) => {
    try {
      let notification = {
        type,
        title,
        description,
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    } catch ({ message }) {}
  };

export const setOverViewData = () => async (dispatch) => {
  await AdminService.getStatistic()
    .then((res) => {
      let data = res.data;
      dispatch({ type: SET_OVERVIEW_DATA, overview: data });
    })
    .catch(() => {
      let notification = {
        type: "warning",
        title: "Thông báo!",
        description: "Có lỗi xảy ra xin vui lòng tải lại trang!",
      };
      dispatch({ type: SET_NOTIFICATION, notification });
    });
};
