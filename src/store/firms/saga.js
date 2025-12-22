import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  FETCH_FIRMS_REQUEST,
  fetchFirmsSuccess,
  fetchFirmsFailure,
} from "./actions";

function* fetchFirmsSaga() {
  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser || !authUser.response?._id) {
      yield put(fetchFirmsFailure("User not authenticated"));
      return;
    }
    const userId = authUser.response._id;
    const response = yield call(
      axios.get,
      `${process.env.REACT_APP_URL}/auth/getCompany/${userId}`
    );

    const firmsData = Array.isArray(response) ? response : [];

    yield put(fetchFirmsSuccess(firmsData));
  } catch (error) {
    yield put(fetchFirmsFailure(error.message || "Failed to fetch firms"));
  }
}

export function* watchFetchFirms() {
  yield takeLatest(FETCH_FIRMS_REQUEST, fetchFirmsSaga);
}
