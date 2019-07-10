import { getCompanies } from '../../Company/services/companyService';
import { getRegions } from '../../Region/services/regionService';
import { getDepts, addDept, editDept, deleteDept } from '../services/deptService';

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
  namespace: 'sysDept',

  state: {
    companies: [],
    regions: [],
    tree: [],
  },

  effects: {
    *getCompanies({ payload }, { call, put }) {
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
        type: 'setDeptTrees',
        payload: response,
      });
    },
    *addDept({ payload, callback }, { call }) {
      const response = yield call(addDept, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editDept({ payload, callback }, { call }) {
      const response = yield call(editDept, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteDept({ payload, callback }, { call }) {
      const response = yield call(deleteDept, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
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
    setDeptTrees(state, action) {
      const list = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        if (action.payload[i].parentId === '0') {
          const deptNode = getDeptNode(action.payload[i], action.payload);
          list.push(deptNode);
        }
      }
      return {
        ...state,
        tree: { list },
      };
    },
  },
};
