import * as types from "../types";

export function selectSample(sample) {
  return (dispatch) => {
    dispatch({
      type: types.SAMPLE_SELECTED,
      payload: sample,
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

export function fetchPackedCircleData(sample) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_PACKED_CIRCLE_DATA,
      payload: sample,
    });
  };
}
