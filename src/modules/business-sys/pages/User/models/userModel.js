import {
  getPageUsers,
  addUser,
  editUser,
  getUser,
  getCurrentUser,
  editPassword,
} from '../services/userService';
import { getDictionaryBatchItems } from '../../Dictionary/services/dictionaryService';
import { getRoles } from '../../Role/services/roleService';
import { getCompanies } from '../../Company/services/companyService';
import { getRegions } from '../../Region/services/regionService';
import { getDepts } from '../../Dept/services/deptService';

const getDeptNode = (obj, arr) => {
  const children = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].parentId === obj.id) {
      const deptNode = getDeptNode(arr[i], arr);
      children.push(deptNode);
    }
  }
  const objNew = { ...obj };
  if (children.length > 0) {
    objNew.children = children;
  }
  return objNew;
};

export default {
  namespace: 'sysUser',

  state: {
    page: {},
    dictionaries: {},
    roles: [],
    user: {},
    currentUser: {},
    companies: [],
    regions: [],
    depts: [],
  },

  effects: {
    *getPageUsers({ payload }, { call, put }) {
      const response = yield call(getPageUsers, payload);
      yield put({
        type: 'setPageUsers',
        payload: response,
      });
    },
    *getDictionaryBatchItems({ payload }, { call, put }) {
      const response = yield call(getDictionaryBatchItems, payload);
      yield put({
        type: 'setBatchItems',
        payload: response,
      });
    },
    *getRoles({ payload }, { call, put }) {
      const response = yield call(getRoles, payload);
      yield put({
        type: 'setRoles',
        payload: response,
      });
    },
    *getCompanys({ payload }, { call, put }) {
      const response = yield call(getCompanies, payload);
      yield put({
        type: 'setCompanies',
        payload: response,
      });
    },
    *getRegions({ payload }, { call, put }) {
      const response = yield call(getRegions, payload);
      yield put({
        type: 'setRegions',
        payload: response,
      });
    },
    *getDepts({ payload }, { call, put }) {
      const response = yield call(getDepts, payload);
      yield put({
        type: 'setDepts',
        payload: response,
      });
    },
    *addUser({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editUser({ payload, callback }, { call }) {
      const response = yield call(editUser, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *getUser({ payload }, { call, put }) {
      if (payload.id !== '') {
        const response = yield call(getUser, payload);
        yield put({
          type: 'setUser',
          payload: response,
        });
      } else {
        yield put({
          type: 'setUser',
          payload: {},
        });
      }
    },
    *getCurrentUser({ payload }, { call, put }) {
      const response = yield call(getCurrentUser, payload);
      yield put({
        type: 'setCurrentUser',
        payload: response,
      });
    },
    *editPassword({ payload, callback }, { call }) {
      const response = yield call(editPassword, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setPageUsers(state, action) {
      return {
        ...state,
        page: action.payload,
      };
    },
    setBatchItems(state, action) {
      return {
        ...state,
        dictionaries: action.payload,
      };
    },
    setRoles(state, action) {
      return {
        ...state,
        roles: action.payload,
      };
    },
    setUser(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
    setCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    setCompanies(state, action) {
      return {
        ...state,
        companies: action.payload,
      };
    },
    setRegions(state, action) {
      return {
        ...state,
        regions: action.payload,
      };
    },
    setDepts(state, action) {
      const list = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        if (action.payload[i].parentId === '0') {
          const deptNode = getDeptNode(action.payload[i], action.payload);
          list.push(deptNode);
        }
      }
      return {
        ...state,
        depts: list,
      };
    },
  },
};
