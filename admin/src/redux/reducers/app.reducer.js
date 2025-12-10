import { SET_NOTIFICATION, SET_OVERVIEW_DATA } from "../type";

const initialState = {
  notification: {
    type: "success",
    title: "",
    description: "",
  },
  overview: {
    instructorTotal: 0,
    studentTotal: 0,
    userTotal: 0,
    revenue: 0,
    chart: [
      {
        x: "Jul",
        y: 0,
      },
    ],
  },
};

export default function (state = initialState, payload) {
  switch (payload.type) {
    case SET_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state,
          ...payload.notification,
        },
      };
    case SET_OVERVIEW_DATA:
      return {
        ...state,
        overview: {
          ...state,
          ...payload.overview,
        },
      };
    default:
      return state;
  }
}
