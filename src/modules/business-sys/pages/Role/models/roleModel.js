import {
  getPageRoles,
  addRole,
  editRole,
  deleteRole,
  getRoleMenus,
  editRoleMenus,
} from '../services/roleService';
import { getMenus } from '../../Menu/services/menuService';

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
  namespace: 'sysRole',

  state: {
    page: {},
    menuTree: [],
  },

  effects: {
    *getPageRoles({ payload }, { call, put }) {
      const response = yield call(getPageRoles, payload);
      yield put({
        type: 'setPageRoles',
        payload: response,
      });
    },
    *addRole({ payload, callback }, { call }) {
      const response = yield call(addRole, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editRole({ payload, callback }, { call }) {
      const response = yield call(editRole, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteRole({ payload, callback }, { call }) {
      const response = yield call(deleteRole, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *getMenus({ payload }, { call, put }) {
      const response = yield call(getMenus, payload);
      yield put({
        type: 'setMenuTrees',
        payload: response,
      });
    },
    *getRoleMenus({ payload, callback }, { call }) {
      const response = yield call(getRoleMenus, payload);
      if (response != null) {
        if (callback) callback(response);
      }
    },
    *editRoleMenus({ payload, callback }, { call }) {
      const response = yield call(editRoleMenus, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setPageRoles(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
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
        menuTree: list,
      };
    },
  },
};
