import React, { PureComponent } from 'react';
import { Button, Divider, Menu, message, Popconfirm, Form, Modal, Input, notification } from 'antd';
import { PageHeaderWrapper, GridContent, StandardTable } from '@/modules/platform-core';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';

// 新增或编辑弹出框
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  let title = '新增分支机构';
  if (values.id != null) {
    title = '编辑分支机构';
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
      <Form.Item label="分支机构编码">
        {form.getFieldDecorator('regionCode', {
          initialValue: values.regionCode,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="分支机构名称">
        {form.getFieldDecorator('regionName', {
          initialValue: values.regionName,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="分支机构名称拼音">
        {form.getFieldDecorator('regionNamePy', {
          initialValue: values.regionNamePy,
        })(<Input />)}
      </Form.Item>
    </Modal>
  );
});

@connect(({ sysRegion, loading }) => ({
  sysRegion,
  loading: loading.models.sysRegion,
}))
@Form.create()
class Region extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '',
      pagination: {},
      selectedRows: [],
      modalVisible: false,
      formValues: {},
    };
    this.columns = [
      {
        title: '分支机构编码',
        dataIndex: 'regionCode',
      },
      {
        title: '分支机构名称',
        dataIndex: 'regionName',
      },
      {
        title: '分支机构名称拼音',
        dataIndex: 'regionNamePy',
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
      type: 'sysRegion/getCompanies',
    });
  }

  componentDidUpdate(currentProps, currentState) {
    const {
      sysRegion: { companies },
    } = currentProps;
    const { selectKey } = currentState;
    if (companies != null && companies.length > 0 && selectKey === '') {
      this.handleMenuSelect({ key: companies[0].id });
    }
  }

  // 菜单选择事件
  handleMenuSelect = menu => {
    this.setState({
      selectKey: menu.key,
    });
    this.handleRefresh(menu.key, true);
  };

  // 列表选中行
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  // 列表变更时间
  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { selectKey } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      companyId: selectKey,
    };

    this.setState({
      pagination,
    });

    dispatch({
      type: 'sysRegion/getPageRegions',
      payload: params,
    });
  };

  // 分支机构列表刷新事件
  handleRefresh = (selectKey, clearSelected) => {
    const { dispatch } = this.props;
    const { pagination } = this.state;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      companyId: selectKey,
    };
    dispatch({
      type: 'sysRegion/getPageRegions',
      payload: params,
    });
    if (clearSelected) {
      this.setState({
        selectedRows: [],
      });
    }
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const { dispatch } = this.props;
    const { selectKey } = this.state;
    if (type === 'add') {
      dispatch({
        type: 'sysRegion/addRegion',
        payload: { ...fields, companyId: selectKey },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh(selectKey);
        },
      });
    } else {
      dispatch({
        type: 'sysRegion/editRegion',
        payload: { ...fields, companyId: selectKey },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh(selectKey);
        },
      });
    }
  };

  // 显示新增或编辑弹出框事件
  handleModalVisible = (flag, record) => {
    const { selectKey } = this.state;
    if (selectKey === '') {
      notification.error({
        message: '请先选择对应机构',
        description: '',
      });
      return;
    }
    this.setState({
      modalVisible: !!flag,
      formValues: record || {},
    });
  };

  // 删除事件
  handleDelete = record => {
    const { dispatch } = this.props;
    const { selectKey } = this.state;
    dispatch({
      type: 'sysRegion/deleteRegion',
      payload: record.id,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.delete.success' }));
        this.handleRefresh(selectKey, true);
      },
    });
  };

  render() {
    const {
      sysRegion: { companies, page },
      loading,
    } = this.props;
    const { selectKey, selectedRows, modalVisible, formValues } = this.state;
    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      loading,
    };

    return (
      <PageHeaderWrapper title="分支机构管理" hiddenBreadcrumb>
        <GridContent>
          <div className="phip-menu-lr-main">
            <div className="phip-menu-lr-main-left">
              {companies != null && companies.length > 0 ? (
                <Menu mode="inline" selectedKeys={[selectKey]} onClick={this.handleMenuSelect}>
                  {companies.map(item => (
                    <Menu.Item key={item.id}>{item.name}</Menu.Item>
                  ))}
                </Menu>
              ) : (
                ''
              )}
            </div>
            <div className="phip-menu-lr-main-right">
              <div className="phip-table">
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
            </div>
          </div>
        </GridContent>
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Region;
