import * as types from "../types";

export function selectSample(data) {
  return (dispatch) => {
    dispatch({
      type: types.SAMPLE_SELECTED,
      payload: data,
    });
  };
}

export function showAMRTable(sample) {
  return (dispatch) => {
    dispatch({
      type: types.SHOW_AMR_TABLE,
      payload: sample,
    });
  };
}

export function dispatchPackedCircleData(data) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_PACKED_CIRCLE_DATA,
      payload: data,
    });
  };
}

export function dispatchPackedCircleRestoreData(data) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_PACKED_CIRCLE_RESTORE_DATA,
      payload: data,
    });
  };
}

export function dispatchDeleteSample(samples) {
  return (dispatch) => {
    dispatch({
      type: types.DELETE_SAMPLE,
      payload: samples,
    });
  };
}

export function dispatchRestoreSample(samples) {
  return (dispatch) => {
    dispatch({
      type: types.RESTORE_SAMPLE,
      payload: samples,
    });
  };
}
