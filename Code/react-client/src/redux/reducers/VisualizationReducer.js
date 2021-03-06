import * as types from '../types';
const initialState = {
  sampleInfo: null,
  antibioticInfo: null,
  amrStatistic: null,
  sampleSelection: null,
  amrTable: null,
  packedCircleData: null,
  packedCircleRestoreData: null,
  networkData: null,
  networkRestoreData: null,
  selectMst: false,
};

export default function Visualization (state = initialState, action) {
  switch (action.type) {
    case types.SAMPLE_SELECTED:
      return {
        ...state,
        sampleInfo: action.payload.sampleInfo,
        amrTable: action.payload.amrTable,
      };

    case types.ANTIBIOTIC_SELECTED:
      return {
        ...state,
        antibioticInfo: action.payload,
      };

    case types.SHOW_AMR_TABLE:
      return {
        ...state,
        amrTable: action.payload,
      };

    case types.FETCH_NETWORK_DATA:
      return {
        ...state,
        networkData: action.payload,
      };

    case types.FETCH_NETWORK_RESTORE_DATA:
      return {
        ...state,
        networkRestoreData: action.payload,
      };

    case types.FETCH_PACKED_CIRCLE_DATA:
      return {
        ...state,
        packedCircleData: action.payload,
      };

    case types.FETCH_PACKED_CIRCLE_RESTORE_DATA:
      return {
        ...state,
        packedCircleRestoreData: action.payload,
      };

    case types.DELETE_SAMPLE:
      return {
        ...state,
        packedCircleData: action.payload,
      };

    case types.RESTORE_SAMPLE:
      return {
        ...state,
        packedCircleData: action.payload,
      };

    case types.DELETE_ANTIBIOTIC:
      return {
        ...state,
        networkData: action.payload,
      };

    case types.RESTORE_ANTIBIOTIC:
      return {
        ...state,
        networkData: action.payload,
      };

    case types.SELECT_MST:
      return {
        ...state,
        selectMst: action.payload,
      };

    default:
      return initialState;
  }
}
