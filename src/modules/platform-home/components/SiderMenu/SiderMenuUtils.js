/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menus
 */
export const getFlatMenuKeys = menuData => {
  let keys = [];
  menuData.forEach(item => {
    keys.push(item);
    if (item.children) {
      keys = keys.concat(getFlatMenuKeys(item.children));
    }
  });
  return keys;
};

const getOpenKeys = (flatMenuKeys, id, openKeys) => {
  let newOpenKeys = [...openKeys];
  for (let i = 0; i < flatMenuKeys.length; i += 1) {
    if (flatMenuKeys[i].id === id) {
      if (flatMenuKeys[i].parentId != null && flatMenuKeys[i].parentId !== '0') {
        newOpenKeys.push(flatMenuKeys[i].parentId);
        newOpenKeys = getOpenKeys(flatMenuKeys, flatMenuKeys[i].parentId, newOpenKeys);
      }
    }
  }
  return newOpenKeys;
};

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
export const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  let openKeys = [];
  for (let i = 0; i < flatMenuKeys.length; i += 1) {
    if (pathname === flatMenuKeys[i].path) {
      if (flatMenuKeys[i].parentId != null && flatMenuKeys[i].parentId !== '0') {
        openKeys.push(flatMenuKeys[i].parentId);
        openKeys = getOpenKeys(flatMenuKeys, flatMenuKeys[i].parentId, openKeys);
      }
    }
  }
  return openKeys;
};
