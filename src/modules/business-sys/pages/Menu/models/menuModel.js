import {
  getMenus,
  addMenu,
  editMenu,
  deleteMenu,
  getMenuUrls,
  editMenuUrls,
} from '../services/menuService';

const getMenuNode = (obj, arr) => {
  const children = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].parentId === obj.id) {
      const menuNode = getMenuNode(arr[i], arr);
      children.push(menuNode);
    }
  }
  const objNew = { ...obj };
  if (children.length > 0) {
    objNew.children = children;
  }
  return objNew;
};

export default {
  namespace: 'sysMenu',

  state: {
    tree: {},
  },

  effects: {
    *getMenus({ payload }, { call, put }) {
      const response = yield call(getMenus, payload);
      yield put({
        type: 'setMenuTrees',
        payload: response,
      });
    },
    *addMenu({ payload, callback }, { call }) {
      const response = yield call(addMenu, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editMenu({ payload, callback }, { call }) {
      const response = yield call(editMenu, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteMenu({ payload, callback }, { call }) {
      const response = yield call(deleteMenu, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *getMenuUrls({ payload, callback }, { call }) {
      const response = yield call(getMenuUrls, payload);
      if (response != null) {
        if (callback) callback(response);
      }
    },
    *editMenuUrls({ payload, callback }, { call }) {
      const response = yield call(editMenuUrls, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setMenuTrees(state, action) {
      const list = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        if (action.payload[i].parentId === '0') {
          const menuNode = getMenuNode(action.payload[i], action.payload);
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
