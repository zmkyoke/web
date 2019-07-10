import {
  getDictionaryTypes,
  getDictionaryItems,
  addDictionaryType,
  addDictionaryItem,
  editDictionaryType,
  deleteDictionaryType,
  editDictionaryItem,
} from '../services/dictionaryService';

const getTypeNode = (obj, arr) => {
  const children = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].parentId === obj.id) {
      const typeNode = getTypeNode(arr[i], arr);
      children.push(typeNode);
    }
  }
  const objNew = { ...obj };
  if (children.length > 0) {
    objNew.children = children;
  }
  return objNew;
};

export default {
  namespace: 'sysDictionary',

  state: {
    typeTree: {},
    types: [],
    items: [],
  },

  effects: {
    *getTypes({ payload }, { call, put }) {
      const response = yield call(getDictionaryTypes, payload);
      yield put({
        type: 'setTypeTrees',
        payload: response,
      });
    },
    *getItems({ payload }, { call, put }) {
      const response = yield call(getDictionaryItems, payload);
      yield put({
        type: 'setItems',
        payload: response,
      });
    },
    *addType({ payload, callback }, { call }) {
      const response = yield call(addDictionaryType, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *addItem({ payload, callback }, { call }) {
      const response = yield call(addDictionaryItem, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editType({ payload, callback }, { call }) {
      const response = yield call(editDictionaryType, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *editItem({ payload, callback }, { call }) {
      const response = yield call(editDictionaryItem, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
    *deleteType({ payload, callback }, { call }) {
      const response = yield call(deleteDictionaryType, payload);
      if (response != null) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    setTypeTrees(state, action) {
      const list = [];
      for (let i = 0; i < action.payload.length; i += 1) {
        if (action.payload[i].parentId === '0') {
          const typeNode = getTypeNode(action.payload[i], action.payload);
          list.push(typeNode);
        }
      }
      return {
        ...state,
        types: action.payload,
        typeTree: { list },
      };
    },
    setItems(state, action) {
      return {
        ...state,
        items: { list: action.payload },
      };
    },
  },
};
