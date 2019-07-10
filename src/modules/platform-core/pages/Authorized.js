import React from 'react';
import Redirect from 'umi/redirect';
import { stringify } from 'qs';
import { RenderAuthorized, getAuthority } from '@/modules/platform-core';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => (
  <Authorized
    authority={children.props.route.authority}
    noMatch={
      <Redirect
        to={{ pathname: '/user/login', search: stringify({ redirect: window.location.href }) }}
      />
    }
  >
    {children}
  </Authorized>
);
