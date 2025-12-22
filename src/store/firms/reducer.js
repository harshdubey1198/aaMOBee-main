import {
  FETCH_FIRMS_REQUEST,
  FETCH_FIRMS_SUCCESS,
  FETCH_FIRMS_FAILURE,
  SET_CURRENT_FIRM,
} from "./actions";

const initialState = {
  firms: [],
  loading: false,
  error: null,
  currentFirmId: null,
};

const firmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FIRMS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_FIRMS_SUCCESS:
      return {
        ...state,
        loading: false,
        firms: action.payload,
        currentFirmId: state.currentFirmId || (action.payload.length > 0 ? action.payload[0]._id : null)
      };
    case FETCH_FIRMS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case SET_CURRENT_FIRM:
      return { ...state, currentFirmId: action.payload };
    default:
      return state;
  }
};

export default firmsReducer;
