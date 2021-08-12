import * as types from '../types';
import axios from 'axios';

export function selectSample (sample) {
  return dispatch => {
    dispatch ({
      type: types.SAMPLE_SELECTED,
      payload: sample,
    });
  };
}

export function showAMRTable (sample) {
  return dispatch => {
    dispatch ({
      type: types.SHOW_AMR_TABLE,
      payload: sample,
    });
  };
}

// export function fetchPackedCircleData(sample) {
//   return (dispatch) => {
//     dispatch({
//       type: types.FETCH_PACKED_CIRCLE_DATA,
//       payload: sample,
//     });
//   };
// }

export async function fetchPackedCircleData (dispatch, getState) {
  const url = '/api/packed-circle';
  await axios
    .get (url)
    .then (response => {
      dispatch ({type: types.FETCH_PACKED_CIRCLE_DATA, payload: response.data.result});
    })
    .catch (error => {
      console.error ('Error fetching data: ', error);
    })
 ;
  
}
