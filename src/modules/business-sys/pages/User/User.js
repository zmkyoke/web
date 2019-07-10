import React, { PureComponent } from 'react';
import { Button, Card, Col, Divider, Form, Input, message, Row } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, StandardTable } from '@/modules/platform-core';

@connect(({ sysUser, loading }) => ({
  sysUser,
  loading: loading.models.sysUser,
}))
@Form.create()
class User extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {},
      selectedRows: [],
      searchValues: {},
    };
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sexCode',
        render: sexCode => {
          const {
            sysUser: { dictionaries },
          } = this.props;
          const dicCode = 'HR_SEX';
          let str = '';
          if (
            dictionaries != null &&
            dictionaries[dicCode] != null &&
            dictionaries[dicCode].length > 0
          ) {
            dictionaries[dicCode].forEach(item => {
              if (sexCode === item.itemCode) {
                str = item.itemName;
              }
            });
          }
          return str;
        },
      },
      {
        title: '出生日期',
        dataIndex: 'birthDate',
      },
      {
        title: '联系电话',
        dataIndex: 'phone',
      },
      {
        title: '电子邮箱',
        dataIndex: 'email',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: status => {
          if (status === '1') {
            return '启用';
          }
          return '停用';
        },
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleEdit(record)}>
              <FormattedMessage id="app.form.btn.edit" />
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.handleUserUse(record)}>
              <FormattedMessage id="app.form.btn.use" />
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.handleUserStop(record)}>
              <FormattedMessage id="app.form.btn.stop" />
            </a>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch, location } = this.props;

    let params = {};
    if (location.state != null && location.state.backValues != null) {
      params = {
        currentPage: location.state.backValues.pagination.current,
        pageSize: location.state.backValues.pagination.pageSize,
        ...location.state.backValues.searchValues,
      };
      this.setState({
        pagination: { ...location.state.backValues.pagination },
        searchValues: { ...location.state.backValues.searchValues },
      });
    }

    dispatch({
      type: 'sysUser/getPageUsers',
      payload: params,
    });
    dispatch({
      type: 'sysUser/getDictionaryBatchItems',
      payload: { typeCodes: 'HR_SEX' },
    });
  }

  // 列表选中行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 查询事件
  handleSearch = e => {
    if (e != null) {
      e.preventDefault();
    }

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        searchValues: values,
        selectedRows: [],
        pagination: {},
      });

      dispatch({
        type: 'sysUser/getPageUsers',
        payload: values,
      });
    });
  };

  // 查询重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      searchValues: {},
      pagination: {},
    });
    dispatch({
      type: 'sysUser/getPageUsers',
      payload: {},
    });
  };

  // 列表变更事件
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues,
    };

    this.setState({
      pagination,
    });

    dispatch({
      type: 'sysUser/getPageUsers',
      payload: params,
    });
  };

  // 刷新事件
  handleRefresh = clearSelected => {
    const { dispatch } = this.props;
    const { searchValues, pagination } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...searchValues,
    };
    dispatch({
      type: 'sysUser/getPageUsers',
      payload: params,
    });
    if (clearSelected) {
      this.setState({
        selectedRows: [],
      });
    }
  };

  // 用户启用
  handleUserUse = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/editUser',
      payload: { id: record.id, status: '1', editUserBasic: '1' },
      callback: () => {
        message.success(formatMessage({ id: 'app.form.submit.success' }));
        this.handleRefresh();
      },
    });
  };

  // 用户停用
  handleUserStop = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/editUser',
      payload: { id: record.id, status: '0', editUserBasic: '1' },
      callback: () => {
        message.success(formatMessage({ id: 'app.form.submit.success' }));
        this.handleRefresh();
      },
    });
  };

  // 新增或编辑用户
  handleEdit = record => {
    const { searchValues, pagination } = this.state;
    router.push({
      pathname: '/sys/user/edit',
      state: {
        id: record ? record.id : '',
        backValues: {
          searchValues: { ...searchValues },
          pagination: { ...pagination },
        },
      },
    });
  };

  // 列表查询条件模板
  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { searchValues } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={8} sm={24}>
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                initialValue: searchValues.username,
              })(<Input placeholder={`${formatMessage({ id: 'app.form.input.please-write' })}`} />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="姓名">
              {getFieldDecorator('name', {
                initialValue: searchValues.name,
              })(<Input placeholder={`${formatMessage({ id: 'app.form.input.please-write' })}`} />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className="phip-table-form-submit">
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="app.form.btn.search" />
              </Button>
              <Button onClick={this.handleFormReset}>
                <FormattedMessage id="app.form.btn.reset" />
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      sysUser: { page },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="用户管理" hiddenBreadcrumb>
        <Card bordered={false}>
          <div className="phip-table">
            <div className="phip-table-form">{this.renderSearchForm()}</div>
            <div className="phip-table-operator">
              <Button icon="plus" type="primary" onClick={() => this.handleEdit()}>
                <FormattedMessage id="app.form.btn.add" />
              </Button>
            </div>
            <StandardTable
              rowKey="id"
              size="middle"
              selectedRows={selectedRows}
              loading={loading}
              data={page}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default User;
