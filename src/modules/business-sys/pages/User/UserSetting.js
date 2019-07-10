import React, { PureComponent } from 'react';
import { Form, Table, Card, Divider, Avatar, Modal, Input, notification, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import md5 from 'md5';
import { PageHeaderWrapper, DescriptionList } from '@/modules/platform-core';
import avatarPng from '@/modules/platform-home/assets/avatar.png';
import styles from './User.less';

// 修改密码弹出框
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, loading } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.newPassword !== fieldsValue.confirmPassword) {
        notification.error({
          message: '新密码与确认密码不一致！',
          description: '',
        });
        return;
      }
      handleEdit(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title="修改密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <Form.Item label="旧密码">
        {form.getFieldDecorator('oldPassword', {
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input.Password visibilityToggle={false} />)}
      </Form.Item>
      <Form.Item label="新密码">
        {form.getFieldDecorator('newPassword', {
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input.Password visibilityToggle={false} />)}
      </Form.Item>
      <Form.Item label="确认密码">
        {form.getFieldDecorator('confirmPassword', {
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input.Password visibilityToggle={false} />)}
      </Form.Item>
    </Modal>
  );
});

@connect(({ sysUser, loading }) => ({
  sysUser,
  loading: loading.models.sysUser,
}))
@Form.create()
class UserSetting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      formValues: {},
    };
    this.columns = [
      {
        title: '机构',
        dataIndex: 'companyName',
      },
      {
        title: '分支机构',
        dataIndex: 'regionName',
      },
      {
        title: '科室',
        dataIndex: 'deptName',
      },
      {
        title: '主岗',
        dataIndex: 'mainFlg',
        render: mainFlg => {
          if (mainFlg === '1') {
            return '是';
          }
          return '否';
        },
      },
      {
        title: '科室负责人',
        dataIndex: 'leaderFlg',
        render: leaderFlg => {
          if (leaderFlg === '1') {
            return '是';
          }
          return '否';
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/getCurrentUser',
    });
    dispatch({
      type: 'sysUser/getDictionaryBatchItems',
      payload: { typeCodes: '001001,001002,001003' },
    });
  }

  // 修改密码弹出框事件
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      formValues: {},
    });
  };

  // 修改密码保存
  handleEdit = fields => {
    const {
      sysUser: { currentUser },
      dispatch,
    } = this.props;
    const params = {
      id: currentUser.id,
      oldPassword: md5(fields.oldPassword).toUpperCase(),
      newPassword: md5(fields.newPassword).toUpperCase(),
      confirmPassword: md5(fields.confirmPassword).toUpperCase(),
    };
    dispatch({
      type: 'sysUser/editPassword',
      payload: params,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.submit.success' }));
        this.handleModalVisible();
      },
    });
  };

  // 取得字典名称
  renderDictionaryName(type, code) {
    const {
      sysUser: { dictionaries },
    } = this.props;
    let str = '';
    if (dictionaries != null && dictionaries[type] != null) {
      const dictionary = dictionaries[type].filter(item => item.itemCode === code)[0];
      if (dictionary != null) {
        str = dictionary.itemName;
      }
    }
    return str;
  }

  render() {
    const {
      sysUser: { currentUser },
      loading,
    } = this.props;
    const { modalVisible, formValues } = this.state;

    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      loading,
    };

    return (
      <PageHeaderWrapper title="个人设置" hiddenBreadcrumb>
        <Card title="基本信息" loading={loading} bordered={false}>
          <div className={styles.basic}>
            <div className={styles.basicLeft}>
              <Avatar size={72} src={avatarPng} />
            </div>
            <div className={styles.basicRight}>
              <div className={styles.basicUserName}>
                用户名：{currentUser.username}
                <a onClick={() => this.handleModalVisible(true)}>修改密码</a>
              </div>
              <div>姓名：{currentUser.name}</div>
            </div>
          </div>
          <Divider />
          <DescriptionList size="large">
            <DescriptionList.Description term="性别">
              {this.renderDictionaryName('001001', currentUser.sexCode)}
            </DescriptionList.Description>
            <DescriptionList.Description term="出生日期">
              {currentUser.birthDate}
            </DescriptionList.Description>
            <DescriptionList.Description term="证件号">
              {currentUser.idNo}
            </DescriptionList.Description>
            <DescriptionList.Description term="电子邮箱">
              {currentUser.email}
            </DescriptionList.Description>
            <DescriptionList.Description term="联系电话">
              {currentUser.phone}
            </DescriptionList.Description>
            <DescriptionList.Description term="职称">
              {this.renderDictionaryName('001003', currentUser.titleCode)}
            </DescriptionList.Description>
          </DescriptionList>
        </Card>
        <Card
          title="组织机构"
          loading={loading}
          bordered={false}
          className="phip-ant-card-form-last"
        >
          <Table
            rowKey="id"
            size="middle"
            columns={this.columns}
            dataSource={currentUser.depts}
            pagination={false}
          />
        </Card>
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default UserSetting;
