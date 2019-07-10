import { getParamItems, addParamItem, editParamItem } from '../services/paramService';

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
  namespace: 'sysParamItem',

  state: {
    tree: {},
  },

  effects: {
    *getParamItems({ payload }, { call, put }) {
      const response = yield call(getParamItems, payload);
      yield put({
        type: 'setParamItemTrees',
        payload: response,
      });
    },
    *addParamItem({ payload, callback }, { call }) {
      const response = yield call(addParamItem, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editParamItem({ payload, callback }, { call }) {
      const response = yield call(editParamItem, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setParamItemTrees(state, action) {
      const list = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        if (action.payload[i].parentId === '0') {
          const menuNode = getParamNode(action.payload[i], action.payload);
          list.push(menuNode);
        }
      }
      return {
        ...state,
        tree: { list },
      };
    },
  },
};
