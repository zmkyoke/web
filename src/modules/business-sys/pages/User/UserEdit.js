import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  message,
  notification,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import md5 from 'md5';
import { PageHeaderWrapper, FooterToolbar } from '@/modules/platform-core';
import UserEditDept from './UserEditDept';

@connect(({ sysUser, loading }) => ({
  sysUser,
  getLoading:
    loading.effects['sysUser/getUser'] || loading.effects['sysUser/getDictionaryBatchItems'],
  loading: loading.models.sysUser,
}))
@Form.create()
class UserEdit extends PureComponent {
  componentDidMount() {
    const { dispatch, location } = this.props;

    if (location.state != null && location.state.id !== '') {
      dispatch({
        type: 'sysUser/getUser',
        payload: { id: location.state.id },
      });
    } else {
      dispatch({
        type: 'sysUser/getUser',
        payload: { id: '' },
      });
    }
    dispatch({
      type: 'sysUser/getDictionaryBatchItems',
      payload: { typeCodes: 'HR_SEX,HR_IDTYPE,HR_TITLE' },
    });
    dispatch({
      type: 'sysUser/getRoles',
      payload: { isDefault: '0' },
    });
  }

  // 取消
  handleCancel = () => {
    const { location } = this.props;
    router.push({
      pathname: '/sys/user',
      state: {
        backValues: location.state ? location.state.backValues : null,
      },
    });
  };

  // 表单提交
  handleSubmit = () => {
    const {
      sysUser: { user },
      form: { validateFieldsAndScroll },
      location,
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (values.depts != null && values.depts.length > 0) {
          let count = 0;
          values.depts.forEach(item => {
            if (item.mainFlg === '1') {
              count += 1;
            }
          });
          if (count > 1) {
            notification.error({
              message: '用户只能有一个主岗',
              description: '',
            });
            return;
          }
        }
        const { password, birthDate, roleIds, ...newValues } = values;
        if (location.state != null && location.state.id !== '') {
          let passwordMd5 = null;
          if (user.password !== password) {
            passwordMd5 = md5(password).toUpperCase();
          }
          dispatch({
            type: 'sysUser/editUser',
            payload: {
              ...newValues,
              id: location.state.id,
              password: passwordMd5,
              birthDate: birthDate.format('YYYY-MM-DD'),
              roleIds: roleIds.join(','),
            },
            callback: () => {
              message.success(formatMessage({ id: 'app.form.submit.success' }));
              this.handleCancel();
            },
          });
        } else {
          const passwordMd5 = md5(password).toUpperCase();
          dispatch({
            type: 'sysUser/addUser',
            payload: {
              ...newValues,
              password: passwordMd5,
              birthDate: birthDate.format('YYYY-MM-DD'),
              roleIds: roleIds.join(','),
            },
            callback: () => {
              message.success(formatMessage({ id: 'app.form.submit.success' }));
              this.handleCancel();
            },
          });
        }
      }
    });
  };

  // 下拉菜单选项
  renderSelectOption(type, code, formItem) {
    const {
      sysUser: { dictionaries, roles },
    } = this.props;

    if (type === 'DIC') {
      if (dictionaries[code] != null) {
        return dictionaries[code].map(item => (
          <Select.Option
            key={`${formItem}_${item.itemCode}`}
            value={item.itemCode}
            py={item.itemNamePy}
          >
            {item.itemName}
          </Select.Option>
        ));
      }
    } else if (type === 'ROLE') {
      if (roles != null && roles.length > 0) {
        return roles.map(item => (
          <Select.Option key={`roleIds_${item.id}`} value={item.id} py={item.roleNamePy}>
            {item.roleName}
          </Select.Option>
        ));
      }
    }

    return '';
  }

  render() {
    const {
      sysUser: { user },
      location,
      getLoading,
      loading,
      form: { getFieldDecorator },
    } = this.props;

    let title = '新增用户';
    if (location.state != null && location.state.id !== '') {
      title = '编辑用户';
    }

    return (
      <PageHeaderWrapper title={title} hiddenBreadcrumb>
        <Card title="基本信息" loading={getLoading} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="用户名">
                  {getFieldDecorator('username', {
                    initialValue: user.username,
                    rules: [
                      { required: true, message: formatMessage({ id: 'app.validation.required' }) },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="密码">
                  {getFieldDecorator('password', {
                    initialValue: user.password,
                    rules: [
                      { required: true, message: formatMessage({ id: 'app.validation.required' }) },
                    ],
                  })(<Input.Password visibilityToggle={false} />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: user.name,
                    rules: [
                      { required: true, message: formatMessage({ id: 'app.validation.required' }) },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="姓名拼音">
                  {getFieldDecorator('namePy', {
                    initialValue: user.namePy,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="性别">
                  {getFieldDecorator('sexCode', {
                    initialValue: user.sexCode,
                    rules: [
                      { required: true, message: formatMessage({ id: 'app.validation.required' }) },
                    ],
                  })(
                    <Select placeholder={formatMessage({ id: 'app.form.input.please-select' })}>
                      {this.renderSelectOption('DIC', 'HR_SEX', 'sexCode')}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="出生日期">
                  {getFieldDecorator('birthDate', {
                    initialValue:
                      user != null && user.birthDate != null
                        ? moment(user.birthDate, 'YYYY-MM-DD')
                        : null,
                    rules: [
                      { required: true, message: formatMessage({ id: 'app.validation.required' }) },
                    ],
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="证件类别">
                  {getFieldDecorator('idType', {
                    initialValue: user.idType,
                  })(
                    <Select
                      allowClear
                      placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                    >
                      {this.renderSelectOption('DIC', 'HR_IDTYPE', 'idType')}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="证件号码">
                  {getFieldDecorator('idNo', {
                    initialValue: user.idNo,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="电子邮箱">
                  {getFieldDecorator('email', {
                    initialValue: user.email,
                    rules: [
                      { type: 'email', message: formatMessage({ id: 'app.validation.email' }) },
                    ],
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="联系电话">
                  {getFieldDecorator('phone', {
                    initialValue: user.phone,
                  })(<Input />)}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="职称">
                  {getFieldDecorator('titleCode', {
                    initialValue: user.titleCode,
                  })(
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="py"
                      placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                    >
                      {this.renderSelectOption('DIC', 'HR_TITLE', 'titleCode')}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="权限">
                  {getFieldDecorator('roleIds', {
                    initialValue:
                      user != null && user.roleIds != null ? user.roleIds.split(',') : [],
                  })(
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="py"
                      mode="multiple"
                      placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                    >
                      {this.renderSelectOption('ROLE', '', 'roleIds')}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <Form.Item label="备注">
                  {getFieldDecorator('remark', {
                    initialValue: user.remark,
                  })(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="组织机构"
          loading={getLoading}
          bordered={false}
          className="phip-ant-card-form-last"
        >
          {getFieldDecorator('depts', {
            initialValue: user.depts,
          })(<UserEditDept />)}
        </Card>
        <FooterToolbar>
          <Button onClick={() => this.handleCancel()}>
            <FormattedMessage id="app.form.btn.cancel" />
          </Button>
          <Button type="primary" onClick={() => this.handleSubmit()} loading={loading}>
            <FormattedMessage id="app.form.btn.submit" />
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default UserEdit;
