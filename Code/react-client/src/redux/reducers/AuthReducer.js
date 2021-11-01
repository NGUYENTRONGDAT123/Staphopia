import * as types from "../types";

const initialState = {
  token: null,
  userLoggedIn: false,
  user: null,
};

export default function Auth(state = initialState, action = {}) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload,
        userLoggedIn: true,
      };

    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        token: "",
        userLoggedIn: false,
      };

    case types.FETCH_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
