import * as types from "../types";
const initialState = {
  sampleInfo: null,
  amrStatistic: null,
  sampleSelection: null,
  amrTable: null,
  packedCircleData: null,
};

export default function Visualization(state = initialState, action) {
  switch (action.type) {
    case types.SAMPLE_SELECTED:
      return {
        ...state,
        sampleInfo: action.payload.sampleInfo,
        amrTable: action.payload.amrTable,
      };

    case types.SHOW_AMR_TABLE:
      return {
        ...state,
        amrTable: action.payload,
      };

    case types.FETCH_PACKED_CIRCLE_DATA:
      return {
        ...state,
        packedCircleData: action.payload,
      };

    default:
      return initialState;
  }
}
