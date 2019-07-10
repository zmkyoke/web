import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Input, Row, Modal, Tree, notification, message, Select } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, GridContent, StandardTable } from '@/modules/platform-core';

// 新增或编辑弹出框
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, roleLoading } = props;
  let title = '新增权限';
  if (values.id != null) {
    title = '编辑权限';
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
      confirmLoading={roleLoading}
    >
      <Form.Item label="权限编码">
        {form.getFieldDecorator('roleCode', {
          initialValue: values.roleCode,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="权限名称">
        {form.getFieldDecorator('roleName', {
          initialValue: values.roleName,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="权限名称拼音">
        {form.getFieldDecorator('roleNamePy', {
          initialValue: values.roleNamePy,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="默认权限">
        {form.getFieldDecorator('isDefault', {
          initialValue: values.isDefault,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(
          <Select placeholder={formatMessage({ id: 'app.form.input.please-select' })} style={{ width: '100px' }}>
            <Select.Option value="1">是</Select.Option>
            <Select.Option value="0">否</Select.Option>
          </Select>
        )}
      </Form.Item>
    </Modal>
  );
});

@connect(({ sysRole, loading }) => ({
  sysRole,
  roleLoading:
    loading.effects['sysRole/getPageRoles'] ||
    loading.effects['sysRole/addRole'] ||
    loading.effects['sysRole/editRole'],
  roleMenuLoading: loading.effects['sysRole/editRoleMenus'],
}))
@Form.create()
class Role extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      pagination: {},
      selectedRows: [],
      selectedRowKeys: [],
      searchValues: {},
      formValues: {},
      treeVisible: false,
      selectMenuIds: [],
    };
    this.columns = [
      {
        title: '权限编码',
        dataIndex: 'roleCode',
      },
      {
        title: '权限名称',
        dataIndex: 'roleName',
      },
      {
        title: '权限名称拼音',
        dataIndex: 'roleNamePy',
      },
      {
        title: '默认权限',
        dataIndex: 'isDefault',
        render: isDefault => {
          if (isDefault === '1') {
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
      type: 'sysRole/getPageRoles',
    });
    dispatch({
      type: 'sysRole/getMenus',
    });
  }

  // 列表选中行
  handleSelectRows = (keys, rows) => {
    const { selectedRowKeys } = this.state;
    let roleId = '';
    if (selectedRowKeys.length === 0 || keys.length === 0) {
      this.setState({
        selectedRowKeys: keys,
        selectedRows: rows,
      });
      if (keys.length === 1) {
        [roleId] = keys;
      }
    } else {
      let index1 = 0;
      for (let i = 0; i < keys.length; i += 1) {
        if (keys[i] !== selectedRowKeys[0]) {
          index1 = i;
          break;
        }
      }
      let index2 = 0;
      for (let i = 0; i < rows.length; i += 1) {
        if (rows[i].id !== selectedRowKeys[0]) {
          index2 = i;
          break;
        }
      }
      this.setState({
        selectedRowKeys: [keys[index1]],
        selectedRows: [rows[index2]],
      });
      roleId = keys[index1];
    }
    this.handleMenuRefresh(roleId);
  };

  // 显示新增或编辑弹出框事件
  handleModalVisible = (flag, type) => {
    const {
      sysRole: { page },
    } = this.props;

    let record = null;
    if (flag) {
      const { selectedRows } = this.state;
      if (type != null && type === 'edit') {
        if (selectedRows == null || selectedRows.length !== 1) {
          notification.error({
            message: '请先选择一行记录',
            description: '',
          });
          return;
        }
        for (let i = 0; i < page.list.length; i += 1) {
          if (selectedRows[0].id === page.list[i].id) {
            record = page.list[i];
          }
        }
      }
    }

    this.setState({
      modalVisible: !!flag,
      formValues: record || { isDefault: '0' },
    });
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const { dispatch } = this.props;
    if (type === 'add') {
      dispatch({
        type: 'sysRole/addRole',
        payload: fields,
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    } else {
      dispatch({
        type: 'sysRole/editRole',
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
      type: 'sysRole/getPageRoles',
      payload: params,
    });
    if (clearSelected) {
      this.setState({
        selectedRows: [],
        selectedRowKeys: [],
      });
    }
  };

  // 删除事件
  handleDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows == null || selectedRows.length !== 1) {
      notification.error({
        message: '请先选择一行记录',
        description: '',
      });
      return;
    }
    Modal.confirm({
      title: formatMessage({ id: 'app.form.sure.delete' }),
      onOk: () => {
        dispatch({
          type: 'sysRole/deleteRole',
          payload: selectedRows[0].id,
          callback: () => {
            message.success(formatMessage({ id: 'app.form.delete.success' }));
            this.handleRefresh(true);
          },
        });
      },
      onCancel: () => {},
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
        selectedRowKeys: [],
      });

      dispatch({
        type: 'sysRole/getPageRoles',
        payload: values,
      });

      this.handleMenuRefresh('');
    });
  };

  // 查询重置事件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      pagination: {},
      searchValues: {},
    });
    dispatch({
      type: 'sysRole/getPageRoles',
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
      type: 'sysRole/getPageRoles',
      payload: params,
    });
  };

  // 权限菜单刷新事件
  handleMenuRefresh = roleId => {
    const { dispatch } = this.props;

    this.setState({
      treeVisible: false,
    });

    if (roleId != null && roleId !== '') {
      dispatch({
        type: 'sysRole/getRoleMenus',
        payload: { roleId },
        callback: roleMenus => {
          const ids = [];
          roleMenus.forEach(item => {
            ids.push(item.menuId);
          });
          this.setState({
            treeVisible: true,
            selectMenuIds: ids,
          });
        },
      });
    }
  };

  // 生成菜单树
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode title={item.name} key={item.id} />;
    });

  // 菜单树选择
  onTreeCheck = checkedKeys => {
    this.setState({
      selectMenuIds: checkedKeys.checked,
    });
  };

  // 菜单权限提交
  handleMenuEdit = () => {
    const { dispatch } = this.props;
    const { selectedRows, selectMenuIds } = this.state;
    if (selectedRows == null || selectedRows.length !== 1) {
      notification.error({
        message: '请先选择一个权限',
        description: '',
      });
      return;
    }

    const selectMenus = [];
    selectMenuIds.forEach(menuId => {
      selectMenus.push({ roleId: selectedRows[0].id, menuId });
    });

    const fields = {
      roleId: selectedRows[0].id,
      list: selectMenus,
    };

    dispatch({
      type: 'sysRole/editRoleMenus',
      payload: fields,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.submit.success' }));
      },
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
          <Col md={14} sm={24}>
            <Form.Item label="权限名称">
              {getFieldDecorator('roleName')(
                <Input placeholder={`${formatMessage({ id: 'app.form.input.please-write' })}`} />
              )}
            </Form.Item>
          </Col>
          <Col md={10} sm={24}>
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
      sysRole: { page, menuTree },
      roleLoading,
      roleMenuLoading,
    } = this.props;
    const { selectedRows, selectedRowKeys, modalVisible, formValues, treeVisible, selectMenuIds } = this.state;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.handleSelectRows,
    };

    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      roleLoading,
    };

    return (
      <PageHeaderWrapper title="权限管理" hiddenBreadcrumb>
        <GridContent>
          <Row gutter={8}>
            <Col lg={13} md={24}>
              <Card bordered={false}>
                <div className="phip-table">
                  <div className="phip-table-form">{this.renderSearchForm()}</div>
                  <div className="phip-table-operator">
                    <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                      <FormattedMessage id="app.form.btn.add" />
                    </Button>
                    <Button
                      icon="edit"
                      disabled={selectedRows.length !== 1}
                      onClick={() => this.handleModalVisible(true, 'edit')}
                    >
                      <FormattedMessage id="app.form.btn.edit" />
                    </Button>
                    <Button icon="delete" disabled={selectedRows.length !== 1} onClick={() => this.handleDelete()}>
                      <FormattedMessage id="app.form.btn.delete" />
                    </Button>
                  </div>
                  <StandardTable
                    className="phip-table-single-selection"
                    rowKey="id"
                    size="middle"
                    rowSelection={rowSelection}
                    selectedRows={selectedRows}
                    loading={roleLoading}
                    data={page}
                    columns={this.columns}
                    onChange={this.handleStandardTableChange}
                  />
                </div>
              </Card>
            </Col>
            <Col lg={11} md={24}>
              <Card bordered={false} loading={roleMenuLoading}>
                <div>
                  <Button
                    icon="save"
                    type="primary"
                    disabled={selectedRows.length !== 1}
                    onClick={() => this.handleMenuEdit()}
                  >
                    <FormattedMessage id="app.form.btn.submit" />
                  </Button>
                </div>
                <div style={{ paddingTop: '16px' }}>
                  {treeVisible && menuTree != null && menuTree.length > 0 ? (
                    <Tree checkable checkStrictly defaultCheckedKeys={selectMenuIds} onCheck={this.onTreeCheck}>
                      {this.renderTreeNodes(menuTree)}
                    </Tree>
                  ) : (
                    ''
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </GridContent>
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Role;
