import {LOGIN, LOGOUT} from './../actions/auth';

const initialState = {
  token: null,
  userId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        token: action.token,
        userId: action.suserId,
      };
    case LOGOUT:
      console.log('inside logout reducer');
      return {
        ...initialState,
        token: null,
      };
    default:
      return state;
  }
};
