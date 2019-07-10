// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  const storageAuthority =
    typeof sessionStorage.getItem('antd-pro-authority') === 'undefined' ||
    sessionStorage.getItem('antd-pro-authority') === null
      ? localStorage.getItem('antd-pro-authority')
      : sessionStorage.getItem('antd-pro-authority');
  const authorityString = typeof str === 'undefined' ? storageAuthority : str;
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority || ['guest'];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return sessionStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
}
