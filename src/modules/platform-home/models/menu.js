import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { Authorized } from '@/modules/platform-core';
import { queryUserMenus } from '../services/user';

const { check } = Authorized;

// Conversion router to menu.
function formatter(data, parentAuthority) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      const result = {
        ...item,
        name: item.name,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority);
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

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
    objNew.routes = children;
  }
  return objNew;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    menus: [],
    breadcrumbNameMap: {},
  },

  effects: {
    *getMenuData({ payload }, { call, put }) {
      const { authority } = payload;
      const response = yield call(queryUserMenus, payload);
      const menus = [];
      for (let i = 0; i < response.length; i += 1) {
        if (response[i].parentId === '0') {
          const menuNode = getMenuNode(response[i], response);
          menus.push(menuNode);
        }
      }
      const menuData = filterMenuData(memoizeOneFormatter(menus, authority));
      const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(menuData);
      yield put({
        type: 'save',
        payload: { menuData, breadcrumbNameMap, menus: response },
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
