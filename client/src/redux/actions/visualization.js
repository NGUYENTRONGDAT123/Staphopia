import * as types from "../types";

export function selectSample(sample) {
  return (dispatch) => {
    dispatch({
      type: types.SAMPLE_SELECTED,
      payload: sample,
    });
  };
}
