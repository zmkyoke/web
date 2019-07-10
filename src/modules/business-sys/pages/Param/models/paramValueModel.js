import { getParamItems, getParamValues, editParamValues } from '../services/paramService';
import { getDictionaryBatchItems } from '../../Dictionary/services/dictionaryService';

const getParamNode = (obj, arr) => {
  const children = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].parentId === obj.id) {
      const paramNode = getParamNode(arr[i], arr);
      children.push(paramNode);
    }
  }
  const objNew = { ...obj };
  if (children.length > 0) {
    objNew.children = children;
  }
  return objNew;
};

export default {
  namespace: 'sysParamValue',

  state: {
    tree: [],
    items: [],
    dictionaries: {},
    paramValues: {},
  },

  effects: {
    *getParamItems({ payload }, { call, put }) {
      const response = yield call(getParamItems, payload);
      yield put({
        type: 'setParamItemTrees',
        payload: response,
      });
    },
    *getDictionaryBatchItems({ payload, callback }, { call, put }) {
      const response = yield call(getDictionaryBatchItems, payload);
      yield put({
        type: 'setBatchDictionaryItems',
        payload: response,
      });
      if (response != null) {
        if (callback) callback();
      }
    },
    *getParamValues({ payload }, { call, put }) {
      const response = yield call(getParamValues, payload);
      yield put({
        type: 'setParamValues',
        payload: response,
      });
    },
    *editParamValues({ payload, callback }, { call }) {
      const response = yield call(editParamValues, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setParamItemTrees(state, action) {
      const pathList = [];
      const itemList = [];
      const list = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        if (action.payload[i].nodeType === 'PATH') {
          pathList.push({ ...action.payload[i] });
        } else if (action.payload[i].nodeType === 'ITEM') {
          itemList.push({ ...action.payload[i] });
        }
      }
      for (let i = 0; i < pathList.length; i += 1) {
        if (pathList[i].parentId === '0') {
          const menuNode = getParamNode(pathList[i], pathList);
          list.push(menuNode);
        }
      }
      return {
        ...state,
        items: itemList,
        tree: list,
      };
    },
    setBatchDictionaryItems(state, action) {
      return {
        ...state,
        dictionaries: action.payload,
      };
    },
    setParamValues(state, action) {
      const paramValues = {};
      for (let i = 0; i < action.payload.length; i += 1) {
        paramValues[action.payload[i].itemCode] = action.payload[i].paramValue;
      }
      return {
        ...state,
        paramValues,
      };
    },
  },
};
