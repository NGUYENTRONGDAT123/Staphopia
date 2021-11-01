import * as types from "../types";

export function selectSample(data) {
  return (dispatch) => {
    dispatch({
      type: types.SAMPLE_SELECTED,
      payload: data,
    });
  };
}

export function selectAntibiotic(data) {
  return (dispatch) => {
    dispatch({
      type: types.ANTIBIOTIC_SELECTED,
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

export function dispatchNetworkData(data) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_NETWORK_DATA,
      payload: data,
    });
  };
}

export function dispatchNetworkRestoreData(data) {
  return (dispatch) => {
    dispatch({
      type: types.FETCH_NETWORK_RESTORE_DATA,
      payload: data,
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

export function dispatchDeleteAntibiotic(antibiotics) {
  return (dispatch) => {
    dispatch({
      type: types.DELETE_ANTIBIOTIC,
      payload: antibiotics,
    });
  };
}

export function dispatchRestoreAntibiotic(antibiotics) {
  return (dispatch) => {
    dispatch({
      type: types.RESTORE_ANTIBIOTIC,
      payload: antibiotics,
    });
  };
}

export function dispatchSelectMst(value) {
  return (dispatch) => {
    dispatch({
      type: types.SELECT_MST,
      payload: value,
    });
  };
}
