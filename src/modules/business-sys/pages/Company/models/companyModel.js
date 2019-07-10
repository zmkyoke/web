import {
  getPageCompanies,
  addCompany,
  editCompany,
  deleteCompany,
} from '../services/companyService';

export default {
  namespace: 'sysCompany',

  state: {
    page: {
      pagination: {},
    },
  },

  effects: {
    *getPageCompanies({ payload }, { call, put }) {
      const response = yield call(getPageCompanies, payload);
      yield put({
        type: 'setPageCompanies',
        payload: response,
      });
    },
    *addCompany({ payload, callback }, { call }) {
      const response = yield call(addCompany, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editCompany({ payload, callback }, { call }) {
      const response = yield call(editCompany, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteCompany({ payload, callback }, { call }) {
      const response = yield call(deleteCompany, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setPageCompanies(state, action) {
      return {
        page: action.payload,
      };
    },
  },
};
