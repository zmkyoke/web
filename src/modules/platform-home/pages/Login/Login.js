import React, { Component } from 'react';
import { connect } from 'dva';
import md5 from 'md5';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Checkbox, Alert } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import { getPageQuery } from '@/modules/platform-core';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    keepUserName: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { password, ...otherValues } = values;
    const passwordMd5 = md5(password).toUpperCase();
    const newValues = { ...otherValues, password: passwordMd5 };
    const { type, keepUserName } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...newValues,
          type,
          keepUserName,
        },
      });
    }
  };

  changeKeepUserName = e => {
    this.setState({
      keepUserName: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, keepUserName } = this.state;

    const params = getPageQuery();
    const { token, redirect } = params;
    const authority = sessionStorage.getItem('antd-pro-authority');
    if (
      login.status == null &&
      authority != null &&
      (authority.indexOf('admin') >= 0 || authority.indexOf('user') >= 0)
    ) {
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = '/';
      }
    }

    if (token != null && token !== '') {
      sessionStorage.setItem('antd-pro-authority', '["TEMP","user"]');
      sessionStorage.setItem('antd-pro-token', token);
      if (redirect) {
        window.location.href = redirect;
      } else {
        window.location.href = '/';
      }
    }

    // 取得用户名
    const storeUserName = localStorage.getItem('antd-pro-username');
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="account"
            tab={formatMessage({ id: 'platform.home.login.tab-login-credentials' })}
          >
            {login.status === 'error' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'platform.home.login.message-invalid-credentials' })
              )}
            <UserName
              name="userName"
              defaultValue={storeUserName}
              placeholder={`${formatMessage({ id: 'platform.home.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.validation.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'platform.home.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'app.validation.required' }),
                },
              ]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <div>
            <Checkbox checked={keepUserName} onChange={this.changeKeepUserName}>
              <FormattedMessage id="platform.home.login.keep-username" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="platform.home.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
