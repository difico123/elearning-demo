import { SET_COURSE_LIST, SET_COURSE_EDIT } from "../type";

const initialState = {
  courses: [
    {
      id: "",
      categoryId: "",
      instructorId: "",
      name: "",
      description: "",
      isPublished: "",
      price: "",
      image: "",
      startCourseTime: "",
      endCourseTime: "",
      created_at: "",
      updated_at: "",
      instructorName: "",
      email: "",
      address: "",
      phone: "",
      avatar: "",
    },
  ],
};

export default function (state = initialState, payload) {
  switch (payload.type) {
    case SET_COURSE_LIST: {
      return { ...state, courses: payload.courses };
    }
    case SET_COURSE_EDIT: {
      const { courseId, body } = payload;
      state.courses = state.courses.map((item) => {
        let course = {};
        if (item.id === courseId) {
          course = body;
        }
        return {
          ...item,
          ...course,
        };
      });

      return { ...state };
    }
    default:
      return state;
  }
}
