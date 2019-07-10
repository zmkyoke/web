import {
  getBatchs,
  addBatch,
  editBatch,
  deleteBatch,
  execBatch,
  getBatchPageLogs,
} from '../services/batchService';

export default {
  namespace: 'sysBatch',

  state: {
    batchs: [],
    logs: {},
  },

  effects: {
    *getBatchs({ payload }, { call, put }) {
      const response = yield call(getBatchs, payload);
      yield put({
        type: 'setBatchs',
        payload: response,
      });
    },
    *addBatch({ payload, callback }, { call }) {
      const response = yield call(addBatch, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editBatch({ payload, callback }, { call }) {
      const response = yield call(editBatch, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteBatch({ payload, callback }, { call }) {
      const response = yield call(deleteBatch, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *execBatch({ payload, callback }, { call }) {
      const response = yield call(execBatch, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *getBatchPageLogs({ payload }, { call, put }) {
      yield put({
        type: 'setBatchPageLogs',
        payload: {},
      });
      const response = yield call(getBatchPageLogs, payload);
      yield put({
        type: 'setBatchPageLogs',
        payload: { id: payload.id, response },
      });
    },
  },

  reducers: {
    setBatchs(state, action) {
      return {
        ...state,
        batchs: { list: action.payload },
      };
    },
    setBatchPageLogs(state, action) {
      const logNews = { ...state.logs };
      logNews[action.payload.id] = action.payload.response;
      return {
        ...state,
        logs: logNews,
      };
    },
  },
};
