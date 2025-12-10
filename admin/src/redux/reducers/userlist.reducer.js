import { SET_USER_LIST, SET_USER_EDIT } from "../type";

const initialState = {
  users: [
    {
      id: "",
      username: "",
      email: "",
      verified: "",
      phone: "",
      address: "",
      avatar: "",
      role: "",
      provider: "",
      password: "",
    },
  ],
};

export default function (state = initialState, payload) {
  switch (payload.type) {
    case SET_USER_LIST: {
      return { ...state, users: payload.users };
    }
    case SET_USER_EDIT: {
      const { userId, body } = payload;
      state.users = state.users.map((item) => {
        let user = {};
        if (item.id === userId) {
          user = body;
        }
        return {
          ...item,
          ...user,
        };
      });

      return { ...state };
    }
    default:
      return state;
  }
}
