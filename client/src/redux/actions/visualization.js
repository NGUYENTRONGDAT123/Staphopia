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
