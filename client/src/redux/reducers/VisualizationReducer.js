import * as types from "../types";
const initialState = {
  sampleInfo: null,
  amrStatistic: null,
  sampleSelection: null,
  amrTable: null,
};

export default function Visualization(state = initialState, action) {
  switch (action.type) {
    case types.SAMPLE_SELECTED:
      return {
        ...state,
        sampleInfo: action.payload,
      };

    case types.SHOW_AMR_TABLE:
      return {
        ...state,
        amrTable: action.payload,
      };

    default:
      return initialState;
  }
}
