import React, { PureComponent } from 'react';
import { Button, Card, Form, Modal, Input, message, notification, Select, Row, Col } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, StandardTable } from '@/modules/platform-core';

// 新增或编辑弹出框
let id = 0;
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  form.getFieldDecorator('keys', { initialValue: 0 });
  let title = '新增参数项目';
  if (values.id != null) {
    title = '编辑参数项目';
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

  const handleFieldChange = (e, fieldName) => {
    values[fieldName] = e;
    id += 1;
    form.setFieldsValue({ keys: id });
  };

  const renderItemDicForm = () => {
    if (values.inputMode === 'DIC') {
      return (
        <Row gutter={16}>
          <Col md={24} sm={24}>
            <Form.Item label="数据字典类别编码">
              {form.getFieldDecorator('dicTypeCode', {
                initialValue: values.dicTypeCode,
                rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
              })(<Input />)}
            </Form.Item>
          </Col>
        </Row>
      );
    }
    return '';
  };

  const renderItemInputForm = () => {
    if (values.inputMode === 'INP') {
      return (
        <Row gutter={16}>
          <Col md={24} sm={24}>
            <Form.Item label="输入类型">
              {form.getFieldDecorator('inputType', {
                initialValue: values.inputType,
                rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
              })(
                <Select placeholder={formatMessage({ id: 'app.form.input.please-select' })} style={{ width: '100%' }}>
                  <Select.Option value="STR">字符串</Select.Option>
                  <Select.Option value="INT">整数</Select.Option>
                  <Select.Option value="NUM">数字</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      );
    }
    return '';
  };

  const renderItemForm = () => {
    if (values.nodeType === 'ITEM') {
      return (
        <div>
          <Row gutter={16}>
            <Col md={12} sm={24}>
              <Form.Item label="输入方式">
                {form.getFieldDecorator('inputMode', {
                  initialValue: values.inputMode,
                  rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
                })(
                  <Select
                    placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                    style={{ width: '100%' }}
                    onChange={e => handleFieldChange(e, 'inputMode')}
                  >
                    <Select.Option value="DIC">数据字典</Select.Option>
                    <Select.Option value="INP">文本框</Select.Option>
                    <Select.Option value="CHE">选择框</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24}>
              <Form.Item label="输入描述">
                {form.getFieldDecorator('describe', {
                  initialValue: values.describe,
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          {renderItemDicForm()}
          {renderItemInputForm()}
        </div>
      );
    }
    return '';
  };

  return (
    <Modal
      width="620px"
      destroyOnClose
      maskClosable={false}
      title={title}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <Form.Item label="项目编码">
            {form.getFieldDecorator('itemCode', {
              initialValue: values.itemCode,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(<Input disabled={!!values.id} />)}
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item label="节点类型">
            {form.getFieldDecorator('nodeType', {
              initialValue: values.nodeType,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(
              <Select
                placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                style={{ width: '100%' }}
                disabled={!!values.id}
                onChange={e => handleFieldChange(e, 'nodeType')}
              >
                <Select.Option value="PATH">路径</Select.Option>
                <Select.Option value="ITEM">项目</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <Form.Item label="项目名称">
            {form.getFieldDecorator('itemName', {
              initialValue: values.itemName,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col md={12} sm={24}>
          <Form.Item label="项目名称拼音">
            {form.getFieldDecorator('itemNamePy', {
              initialValue: values.itemNamePy,
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      {renderItemForm()}
      <Row gutter={16}>
        <Col md={24} sm={24}>
          <Form.Item label="备注">
            {form.getFieldDecorator('remark', {
              initialValue: values.remark,
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ sysParamItem, loading }) => ({
  sysParamItem,
  loading: loading.models.sysParamItem,
}))
class ParamItem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      formValues: {},
    };
    this.columns = [
      {
        title: '项目编码',
        dataIndex: 'itemCode',
      },
      {
        title: '项目名称',
        dataIndex: 'itemName',
      },
      {
        title: '项目名称拼音',
        dataIndex: 'itemNamePy',
      },
      {
        title: '节点类型',
        dataIndex: 'nodeType',
        render: nodeType => {
          let str = '';
          if (nodeType === 'ITEM') {
            str = '项目';
          } else {
            str = '路径';
          }
          return str;
        },
      },
      {
        title: '输入方式',
        dataIndex: 'inputMode',
        render: inputMode => {
          let str = '';
          if (inputMode === 'DIC') {
            str = '数据字典';
          } else if (inputMode === 'CHE') {
            str = '选择框';
          } else if (inputMode === 'INP') {
            str = '文本框';
          }
          return str;
        },
      },
      {
        title: '输入类型',
        dataIndex: 'inputType',
        render: inputType => {
          let str = '';
          if (inputType === 'INT') {
            str = '整数';
          } else if (inputType === 'NUM') {
            str = '数字';
          } else if (inputType === 'STR') {
            str = '字符串';
          }
          return str;
        },
      },
      {
        title: '输入描述',
        dataIndex: 'describe',
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleModalVisible(true, record)}>
              <FormattedMessage id="app.form.btn.edit" />
            </a>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysParamItem/getParamItems',
    });
  }

  // 列表选中行
  handleSelectRows = (keys, rows) => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0 || keys.length === 0) {
      this.setState({
        selectedRowKeys: keys,
        selectedRows: rows,
      });
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
    }
  };

  // 菜单列表刷新事件
  handleRefresh = clearSelected => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysParamItem/getParamItems',
    });
    if (clearSelected) {
      this.setState({
        selectedRowKeys: [],
        selectedRows: [],
      });
    }
  };

  // 显示新增或编辑弹出框事件
  handleModalVisible = (flag, record) => {
    const { selectedRows } = this.state;
    if (
      record == null &&
      flag &&
      selectedRows != null &&
      selectedRows.length === 1 &&
      selectedRows[0].nodeType === 'ITEM'
    ) {
      notification.error({
        message: '项目下不能再继续添加节点',
        description: '',
      });
      return;
    }
    this.setState({
      modalVisible: !!flag,
      formValues: record || {},
    });
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (type === 'add') {
      let parentId = '0';
      if (selectedRows != null && selectedRows.length === 1) {
        parentId = selectedRows[0].id;
      }
      dispatch({
        type: 'sysParamItem/addParamItem',
        payload: { ...fields, parentId },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    } else {
      dispatch({
        type: 'sysParamItem/editParamItem',
        payload: { ...fields },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    }
  };

  render() {
    const {
      sysParamItem: { tree },
      loading,
    } = this.props;
    const { selectedRowKeys, selectedRows, modalVisible, formValues } = this.state;

    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      loading,
    };
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.handleSelectRows,
    };

    return (
      <PageHeaderWrapper title="参数项目管理" hiddenBreadcrumb>
        <Card bordered={false}>
          <div className="phip-table">
            <div className="phip-table-operator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                <FormattedMessage id="app.form.btn.add" />
              </Button>
            </div>
            <StandardTable
              className="phip-table-single-selection"
              rowKey="id"
              size="middle"
              selectedRows={selectedRows}
              rowSelection={rowSelection}
              loading={loading}
              data={tree}
              columns={this.columns}
              pagination={false}
            />
          </div>
        </Card>
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default ParamItem;
