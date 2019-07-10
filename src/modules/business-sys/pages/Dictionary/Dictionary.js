import React, { PureComponent } from 'react';
import { Form, Row, Col, Card, Button, Modal, Input, Select, notification, message, InputNumber, Badge } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, GridContent, StandardTable } from '@/modules/platform-core';

// 类别新增或编辑弹出框
const EditTypeForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, typeLoading } = props;
  let title = '新增类别';
  if (values.id != null) {
    title = '编辑类别';
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
      confirmLoading={typeLoading}
    >
      <Form.Item label="类别编码">
        {form.getFieldDecorator('typeCode', {
          initialValue: values.typeCode,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="类别名称">
        {form.getFieldDecorator('typeName', {
          initialValue: values.typeName,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="类别名称拼音">
        {form.getFieldDecorator('typeNamePy', {
          initialValue: values.typeNamePy,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="节点类型">
        {form.getFieldDecorator('nodeType', {
          initialValue: values.nodeType,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(
          <Select
            placeholder={formatMessage({ id: 'app.form.input.please-select' })}
            style={{ width: '100px' }}
            disabled={!!values.id}
          >
            <Select.Option value="PATH">路径</Select.Option>
            <Select.Option value="TYPE">类别</Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="编码规则">
        {form.getFieldDecorator('codeRule', {
          initialValue: values.codeRule,
        })(<Input />)}
      </Form.Item>
    </Modal>
  );
});

// 项目新增或编辑弹出框
const EditItemForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, itemLoading } = props;
  let title = '新增项目';
  if (values.id != null) {
    title = '编辑项目';
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
      confirmLoading={itemLoading}
    >
      <Form.Item label="项目编码">
        {form.getFieldDecorator('itemCode', {
          initialValue: values.itemCode,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="项目名称">
        {form.getFieldDecorator('itemName', {
          initialValue: values.itemName,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="项目名称拼音">
        {form.getFieldDecorator('itemNamePy', {
          initialValue: values.itemNamePy,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="状态">
        {form.getFieldDecorator('status', {
          initialValue: values.status,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(
          <Select placeholder={formatMessage({ id: 'app.form.input.please-select' })} style={{ width: '100px' }}>
            <Select.Option value="1">启用</Select.Option>
            <Select.Option value="0">停用</Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="序号">
        {form.getFieldDecorator('seqNum', {
          initialValue: values.seqNum,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.number' }) }],
        })(<InputNumber min={0} style={{ width: '100%' }} />)}
      </Form.Item>
    </Modal>
  );
});

@connect(({ sysDictionary, loading }) => ({
  sysDictionary,
  typeLoading:
    loading.effects['sysDictionary/getTypes'] ||
    loading.effects['sysDictionary/addType'] ||
    loading.effects['sysDictionary/editType'],
  itemLoading:
    loading.effects['sysDictionary/getItems'] ||
    loading.effects['sysDictionary/addItem'] ||
    loading.effects['sysDictionary/editItem'],
}))
@Form.create()
class Dictionary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalTypeVisible: false,
      modalItemVisible: false,
      selectedTypeRowKeys: [],
      selectedTypeRows: [],
      selectedItemRows: [],
      formTypeValues: {},
      formItemValues: {},
    };
    this.typeColumns = [
      {
        title: '类别编码',
        dataIndex: 'typeCode',
        width: 220,
      },
      {
        title: '类别名称',
        dataIndex: 'typeName',
        width: 150,
      },
      {
        title: '节点类型',
        dataIndex: 'nodeType',
        width: 80,
        render: nodeType => {
          if (nodeType === 'TYPE') {
            return '类别';
          }
          return '路径';
        },
      },
      {
        title: '类别名称拼音',
        dataIndex: 'typeNamePy',
        width: 120,
      },
      {
        title: '编码规则',
        dataIndex: 'codeRule',
        width: 150,
      },
    ];
    this.itemColumns = [
      {
        title: '项目编码',
        dataIndex: 'itemCode',
        width: 120,
      },
      {
        title: '项目名称',
        dataIndex: 'itemName',
        width: 160,
      },
      {
        title: '项目名称拼音',
        dataIndex: 'itemNamePy',
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: status => {
          if (status === '1') {
            return <Badge status="success" text="已启用" />;
          }
          return <Badge status="error" text="已停用" />;
        },
      },
      {
        title: '序号',
        dataIndex: 'seqNum',
        width: 100,
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysDictionary/getTypes',
    });
    dispatch({
      type: 'sysDictionary/getItems',
      payload: { typeId: '' },
    });
  }

  // 类别列表选中行
  handleSelectTypeRows = (keys, rows) => {
    const { selectedTypeRowKeys } = this.state;
    let typeId = '';
    if (selectedTypeRowKeys.length === 0 || keys.length === 0) {
      this.setState({
        selectedTypeRowKeys: keys,
        selectedTypeRows: rows,
      });
      if (keys.length === 1) {
        [typeId] = keys;
      }
    } else {
      let index1 = 0;
      for (let i = 0; i < keys.length; i += 1) {
        if (keys[i] !== selectedTypeRowKeys[0]) {
          index1 = i;
          break;
        }
      }
      let index2 = 0;
      for (let i = 0; i < rows.length; i += 1) {
        if (rows[i].id !== selectedTypeRowKeys[0]) {
          index2 = i;
          break;
        }
      }
      this.setState({
        selectedTypeRowKeys: [keys[index1]],
        selectedTypeRows: [rows[index2]],
      });
      typeId = keys[index1];
    }
    this.handleItemRefresh(typeId, true);
  };

  // 项目列表选中行
  handleSelectItemRows = rows => {
    this.setState({
      selectedItemRows: rows,
    });
  };

  // 刷新类别列表
  handleTypeRefresh = clearSelected => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysDictionary/getTypes',
    });

    if (clearSelected) {
      this.setState({
        selectedTypeRowKeys: [],
        selectedTypeRows: [],
      });
    }
  };

  // 刷新项目列表
  handleItemRefresh = (selectKey, clearSelected) => {
    const { dispatch } = this.props;

    const params = { typeId: selectKey };

    dispatch({
      type: 'sysDictionary/getItems',
      payload: params,
    });

    if (clearSelected) {
      this.setState({
        selectedItemRows: [],
      });
    }
  };

  // 显示类别新增或编辑弹出框事件
  handleTypeModalVisible = (flag, type) => {
    let record = null;
    if (flag) {
      const {
        sysDictionary: { types },
      } = this.props;
      const { selectedTypeRows } = this.state;
      if (
        selectedTypeRows != null &&
        selectedTypeRows.length === 1 &&
        selectedTypeRows[0].nodeType === 'TYPE' &&
        type == null
      ) {
        notification.error({
          message: '类别下不能再添加类别',
          description: '',
        });
        return;
      }
      if (type != null && type === 'edit') {
        for (let i = 0; i < types.length; i += 1) {
          if (selectedTypeRows[0].id === types[i].id) {
            record = types[i];
          }
        }
      }
    }
    this.setState({
      modalTypeVisible: !!flag,
      formTypeValues: record || {},
    });
  };

  // 类别新增或编辑保存
  handleTypeEdit = (type, fields) => {
    const { dispatch } = this.props;
    const { selectedTypeRows } = this.state;
    if (type === 'add') {
      let parentId = '0';
      if (selectedTypeRows != null && selectedTypeRows.length === 1) {
        parentId = selectedTypeRows[0].id;
      }
      dispatch({
        type: 'sysDictionary/addType',
        payload: { ...fields, parentId },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleTypeModalVisible();
          this.handleTypeRefresh();
        },
      });
    } else {
      dispatch({
        type: 'sysDictionary/editType',
        payload: { ...fields },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleTypeModalVisible();
          this.handleTypeRefresh();
        },
      });
    }
  };

  // 类别删除事件
  handleTypeDelete = () => {
    const { dispatch } = this.props;
    const { selectedTypeRows } = this.state;
    Modal.confirm({
      title: formatMessage({ id: 'app.form.sure.delete' }),
      onOk: () => {
        dispatch({
          type: 'sysDictionary/deleteType',
          payload: selectedTypeRows[0].id,
          callback: () => {
            message.success(formatMessage({ id: 'app.form.delete.success' }));
            this.handleTypeRefresh(true);
          },
        });
      },
      onCancel: () => {},
    });
  };

  // 显示项目新增或编辑弹出框事件
  handleItemModalVisible = (flag, type) => {
    let seqNumNew = 0;
    let record = null;
    if (flag) {
      const {
        sysDictionary: { items },
      } = this.props;
      const { selectedTypeRows, selectedItemRows } = this.state;
      if (
        selectedTypeRows == null ||
        selectedTypeRows.length !== 1 ||
        (selectedTypeRows.length === 1 && selectedTypeRows[0].nodeType !== 'TYPE')
      ) {
        notification.error({
          message: '请先选择一个数据字典类别',
          description: '',
        });
        return;
      }
      for (let i = 0; i < items.list.length; i += 1) {
        const { seqNum } = items.list[i];
        if (Number(seqNum) > seqNumNew) {
          seqNumNew = Number(seqNum);
        }
        if (type != null && type === 'edit' && selectedItemRows[0].id === items.list[i].id) {
          record = items.list[i];
        }
      }
    }
    this.setState({
      modalItemVisible: !!flag,
      formItemValues: record || { status: '1', seqNum: seqNumNew + 1 },
    });
  };

  // 项目新增或编辑保存
  handleItemEdit = (type, fields) => {
    const { dispatch } = this.props;
    const { selectedTypeRows } = this.state;
    if (type === 'add') {
      dispatch({
        type: 'sysDictionary/addItem',
        payload: {
          ...fields,
          typeId: selectedTypeRows[0].id,
          typeCode: selectedTypeRows[0].typeCode,
        },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleItemModalVisible();
          this.handleItemRefresh(selectedTypeRows[0].id);
        },
      });
    } else {
      dispatch({
        type: 'sysDictionary/editItem',
        payload: {
          ...fields,
          typeId: selectedTypeRows[0].id,
          typeCode: selectedTypeRows[0].typeCode,
        },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleItemModalVisible();
          this.handleItemRefresh(selectedTypeRows[0].id);
        },
      });
    }
  };

  // 项目启用
  handleItemStart = () => {
    const { dispatch } = this.props;
    const { selectedTypeRows, selectedItemRows } = this.state;
    let count = 0;
    selectedItemRows.forEach(selectedItemRow => {
      dispatch({
        type: 'sysDictionary/editItem',
        payload: {
          id: selectedItemRow.id,
          status: '1',
          typeId: selectedTypeRows[0].id,
          typeCode: selectedTypeRows[0].typeCode,
        },
        callback: () => {
          count += 1;
          if (count === selectedItemRows.length) {
            message.success(formatMessage({ id: 'app.form.submit.success' }));
            this.handleItemRefresh(selectedTypeRows[0].id);
          }
        },
      });
    });
  };

  // 项目停用
  handleItemStop = () => {
    const { dispatch } = this.props;
    const { selectedTypeRows, selectedItemRows } = this.state;
    let count = 0;
    selectedItemRows.forEach(selectedItemRow => {
      dispatch({
        type: 'sysDictionary/editItem',
        payload: {
          id: selectedItemRow.id,
          status: '0',
          typeId: selectedTypeRows[0].id,
          typeCode: selectedTypeRows[0].typeCode,
        },
        callback: () => {
          count += 1;
          if (count === selectedItemRows.length) {
            message.success(formatMessage({ id: 'app.form.submit.success' }));
            this.handleItemRefresh(selectedTypeRows[0].id);
          }
        },
      });
    });
  };

  render() {
    const {
      sysDictionary: { typeTree, items },
      typeLoading,
      itemLoading,
    } = this.props;
    const {
      selectedTypeRowKeys,
      selectedTypeRows,
      selectedItemRows,
      modalTypeVisible,
      formTypeValues,
      modalItemVisible,
      formItemValues,
    } = this.state;
    const rowSelectionType = {
      type: 'checkbox',
      selectedRowKeys: selectedTypeRowKeys,
      onChange: this.handleSelectTypeRows,
    };

    const parentTypeMethods = {
      handleEdit: this.handleTypeEdit,
      handleModalVisible: this.handleTypeModalVisible,
      typeLoading,
    };

    const parentItemMethods = {
      handleEdit: this.handleItemEdit,
      handleModalVisible: this.handleItemModalVisible,
      itemLoading,
    };

    return (
      <PageHeaderWrapper title="数据字典" hiddenBreadcrumb>
        <GridContent>
          <Row gutter={8}>
            <Col lg={9} md={24}>
              <Card bordered={false}>
                <div className="phip-table">
                  <div className="phip-table-operator">
                    <Button icon="plus" type="primary" onClick={() => this.handleTypeModalVisible(true)}>
                      <FormattedMessage id="app.form.btn.add" />
                    </Button>
                    <Button
                      icon="edit"
                      disabled={selectedTypeRows.length !== 1}
                      onClick={() => this.handleTypeModalVisible(true, 'edit')}
                    >
                      <FormattedMessage id="app.form.btn.edit" />
                    </Button>
                    <Button
                      icon="delete"
                      disabled={selectedTypeRows.length !== 1}
                      type="danger"
                      onClick={() => this.handleTypeDelete()}
                    >
                      <FormattedMessage id="app.form.btn.delete" />
                    </Button>
                  </div>
                  <StandardTable
                    className="phip-table-single-selection"
                    rowKey="id"
                    size="middle"
                    rowSelection={rowSelectionType}
                    selectedRows={selectedTypeRows}
                    loading={typeLoading}
                    data={typeTree}
                    columns={this.typeColumns}
                    scroll={{ x: 720 }}
                    pagination={false}
                  />
                </div>
              </Card>
            </Col>
            <Col lg={15} md={24}>
              <Card bordered={false}>
                <div className="phip-table">
                  <div className="phip-table-operator">
                    <Button icon="plus" type="primary" onClick={() => this.handleItemModalVisible(true)}>
                      <FormattedMessage id="app.form.btn.add" />
                    </Button>
                    <Button
                      icon="edit"
                      disabled={selectedItemRows.length !== 1}
                      onClick={() => this.handleItemModalVisible(true, 'edit')}
                    >
                      <FormattedMessage id="app.form.btn.edit" />
                    </Button>
                    <Button
                      icon="check"
                      disabled={selectedItemRows.length === 0}
                      onClick={() => this.handleItemStart()}
                    >
                      <FormattedMessage id="app.form.btn.use" />
                    </Button>
                    <Button icon="stop" disabled={selectedItemRows.length === 0} onClick={() => this.handleItemStop()}>
                      <FormattedMessage id="app.form.btn.stop" />
                    </Button>
                  </div>
                  <StandardTable
                    rowKey="id"
                    size="middle"
                    selectedRows={selectedItemRows}
                    loading={itemLoading}
                    data={items}
                    columns={this.itemColumns}
                    onSelectRow={this.handleSelectItemRows}
                    pagination={false}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </GridContent>
        <EditTypeForm {...parentTypeMethods} modalVisible={modalTypeVisible} values={formTypeValues} />
        <EditItemForm {...parentItemMethods} modalVisible={modalItemVisible} values={formItemValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Dictionary;
