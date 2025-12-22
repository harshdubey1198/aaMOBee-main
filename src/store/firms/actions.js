export const FETCH_FIRMS_REQUEST = "FETCH_FIRMS_REQUEST";
export const FETCH_FIRMS_SUCCESS = "FETCH_FIRMS_SUCCESS";
export const FETCH_FIRMS_FAILURE = "FETCH_FIRMS_FAILURE";

export const SET_CURRENT_FIRM = "SET_CURRENT_FIRM";

export const fetchFirmsRequest = () => ({
  type: FETCH_FIRMS_REQUEST,
});

export const fetchFirmsSuccess = (firms) => ({
  type: FETCH_FIRMS_SUCCESS,
  payload: firms,
});

export const fetchFirmsFailure = (error) => ({
  type: FETCH_FIRMS_FAILURE,
  payload: error,
});

export const setCurrentFirm = (firmId) => ({
  type: SET_CURRENT_FIRM,
  payload: firmId,
});
