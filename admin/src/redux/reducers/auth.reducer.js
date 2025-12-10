import { SET_TOKEN, SET_USER, SET_ERROR } from "../type";

const initialState = {
  token: "",
  user: {
    address: null,
    avatar: "",
    created_at: "",
    email: "",
    id: "",
    phone: "",
    provider: "",
    role: "",
    unreadNotification: 0,
    updated_at: "",
    username: "",
    verified: true,
  },
  error: {
    status: false,
    message: "",
  },
};

export default function (state = initialState, payload) {
  switch (payload.type) {
    case SET_TOKEN:
      return { ...state, token: payload.token };
    case SET_USER:
      return { ...state, user: payload.user };
    case SET_ERROR:
      return { ...state, error: payload.error };
    default:
      return state;
  }
}
