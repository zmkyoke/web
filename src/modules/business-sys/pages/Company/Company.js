import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Button, Input, Modal, message, Popconfirm, Divider } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, StandardTable } from '@/modules/platform-core';

// 新增或编辑弹出框
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  let title = '新增机构';
  if (values.id != null) {
    title = '编辑机构';
  }
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (values.id == null) {
        handleEdit('add', fieldsValue);
      } else {
        handleEdit('edit', { ...fieldsValue, id: values.id });
      }
    });
  };
  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <Form.Item label="机构编码">
        {form.getFieldDecorator('code', {
          initialValue: values.code,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="机构名称">
        {form.getFieldDecorator('name', {
          initialValue: values.name,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="机构名称拼音">
        {form.getFieldDecorator('namePy', {
          initialValue: values.namePy,
        })(<Input />)}
      </Form.Item>
    </Modal>
  );
});

@connect(({ sysCompany, loading }) => ({
  sysCompany,
  loading: loading.models.sysCompany,
}))
@Form.create()
class Company extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      pagination: {},
      selectedRows: [],
      searchValues: {},
      formValues: {},
    };
    this.columns = [
      {
        title: '机构编码',
        dataIndex: 'code',
      },
      {
        title: '机构名称',
        dataIndex: 'name',
      },
      {
        title: '机构名称拼音',
        dataIndex: 'namePy',
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleModalVisible(true, record)}>
              <FormattedMessage id="app.form.btn.edit" />
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title={`${formatMessage({ id: 'app.form.sure.delete' })}`}
              onConfirm={() => this.handleDelete(record)}
            >
              <a>
                <FormattedMessage id="app.form.btn.delete" />
              </a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCompany/getPageCompanies',
    });
  }

  // 列表选中行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 删除事件
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysCompany/deleteCompany',
      payload: record.id,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.delete.success' }));
        this.handleRefresh(true);
      },
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
        type: 'sysCompany/getPageCompanies',
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
      type: 'sysCompany/getPageCompanies',
      payload: {},
    });
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const { dispatch } = this.props;
    if (type === 'add') {
      dispatch({
        type: 'sysCompany/addCompany',
        payload: fields,
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    } else {
      dispatch({
        type: 'sysCompany/editCompany',
        payload: fields,
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    }
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
      type: 'sysCompany/getPageCompanies',
      payload: params,
    });
    if (clearSelected) {
      this.setState({
        selectedRows: [],
      });
    }
  };

  // 显示新增或编辑弹出框事件
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      formValues: record || {},
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
      type: 'sysCompany/getPageCompanies',
      payload: params,
    });
  };

  // 列表查询条件模板
  renderSearchForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={16}>
          <Col md={8} sm={24}>
            <Form.Item label="机构名称">
              {getFieldDecorator('name')(
                <Input placeholder={`${formatMessage({ id: 'app.form.input.please-write' })}`} />
              )}
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
      sysCompany: { page },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, formValues } = this.state;

    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      loading,
    };

    return (
      <PageHeaderWrapper title="机构管理" hiddenBreadcrumb>
        <Card bordered={false}>
          <div className="phip-table">
            <div className="phip-table-form">{this.renderSearchForm()}</div>
            <div className="phip-table-operator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Company;
