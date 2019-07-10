import { getCompanies } from '../../Company/services/companyService';
import { getPageRegions, addRegion, editRegion, deleteRegion } from '../services/regionService';

export default {
  namespace: 'sysRegion',

  state: {
    page: {
      pagination: {},
    },
    companies: [],
  },

  effects: {
    *getCompanies({ payload }, { call, put }) {
      const response = yield call(getCompanies, payload);
      yield put({
        type: 'setCompanies',
        payload: response,
      });
    },
    *getPageRegions({ payload }, { call, put }) {
      const response = yield call(getPageRegions, payload);
      yield put({
        type: 'setPage',
        payload: response,
      });
    },
    *addRegion({ payload, callback }, { call }) {
      const response = yield call(addRegion, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editRegion({ payload, callback }, { call }) {
      const response = yield call(editRegion, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteRegion({ payload, callback }, { call }) {
      const response = yield call(deleteRegion, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setPage(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
    setCompanies(state, action) {
      return {
        ...state,
        companies: action.payload,
      };
    },
  },
};
