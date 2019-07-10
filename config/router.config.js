export default [
  // user
  {
    path: '/user',
    component: '../modules/platform-home/layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: '../modules/platform-home/pages/Login/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../modules/platform-home/layouts/BasicLayout',
    Routes: ['src/modules/platform-core/pages/Authorized'],
    authority: ['user'],
    routes: [
      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: '../modules/platform-home/pages/Dashboard/Dashboard' },
      { path: '/sys/company', component: '../modules/business-sys/pages/Company/Company' },
      { path: '/sys/region', component: '../modules/business-sys/pages/Region/Region' },
      { path: '/sys/dept', component: '../modules/business-sys/pages/Dept/Dept' },
      { path: '/sys/dictionary', component: '../modules/business-sys/pages/Dictionary/Dictionary' },
      { path: '/sys/menu', component: '../modules/business-sys/pages/Menu/Menu' },
      { path: '/sys/role', component: '../modules/business-sys/pages/Role/Role' },
      { path: '/sys/user', component: '../modules/business-sys/pages/User/User' },
      { path: '/sys/user/edit', component: '../modules/business-sys/pages/User/UserEdit' },
      { path: '/sys/userSetting', component: '../modules/business-sys/pages/User/UserSetting' },
      { path: '/sys/param/item', component: '../modules/business-sys/pages/Param/ParamItem' },
      { path: '/sys/param/value', component: '../modules/business-sys/pages/Param/ParamValue' },
      { path: '/sys/batch', component: '../modules/business-sys/pages/Batch/Batch' },
      { path: '/result/success', component: '../modules/platform-core/pages/Result/Success' },
      { path: '/result/fail', component: '../modules/platform-core/pages/Result/Error' },
      { path: '/exception/403', component: '../modules/platform-core/pages/Exception/403' },
      { path: '/exception/404', component: '../modules/platform-core/pages/Exception/404' },
      { path: '/exception/500', component: '../modules/platform-core/pages/Exception/500' },
      { component: '../modules/platform-core/pages/Exception/404' },
    ],
  },
];
