import React, { PureComponent } from 'react';
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Row,
  Col,
  Icon,
  notification,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { PageHeaderWrapper, StandardTable } from '@/modules/platform-core';

// 新增或编辑弹出框
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  let title = '新增菜单';
  if (values.id != null) {
    title = '编辑菜单';
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
      <Form.Item label="菜单编码">
        {form.getFieldDecorator('code', {
          initialValue: values.code,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="菜单名称">
        {form.getFieldDecorator('name', {
          initialValue: values.name,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="菜单名称拼音">
        {form.getFieldDecorator('namePy', {
          initialValue: values.namePy,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="菜单名称简称">
        {form.getFieldDecorator('nameAbs', {
          initialValue: values.nameAbs,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
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
            <Select.Option value="PAGE">页面</Select.Option>
            <Select.Option value="FUNC">功能</Select.Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="路由地址">
        {form.getFieldDecorator('path', {
          initialValue: values.path,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="图标">
        {form.getFieldDecorator('icon', {
          initialValue: values.icon,
        })(<Input />)}
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

// 设置URL新增或编辑弹出框
let id = 0;
const EditUrlForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  form.getFieldDecorator('keys', { initialValue: 0 });

  const removeUrl = item => {
    if (values.urls.length === 1) {
      return;
    }
    id += 1;
    values.urls = values.urls.filter(obj => obj.id !== item.id);
    form.setFieldsValue({ keys: id });
  };

  const addUrl = () => {
    id += 1;
    values.urls.push({ id, url: '', requestMethod: null });
    form.setFieldsValue({ keys: id });
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleEdit(fieldsValue, values.menuId);
    });
  };

  let formItems = '';
  if (values.urls != null) {
    formItems = values.urls.map((item, index) => (
      <Row gutter={16} key={`Row_${item.id}`}>
        <Col md={13} sm={24} key={`Col_0_${item.id}`}>
          <Form.Item label={index === 0 ? 'URL' : ''} colon={false}>
            {form.getFieldDecorator(`url[${item.id}]`, {
              initialValue: item.url,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col md={9} sm={24} key={`Col_1_${item.id}`}>
          <Form.Item label={index === 0 ? '请求类型' : ''} colon={false}>
            {form.getFieldDecorator(`requestMethod[${item.id}]`, {
              initialValue: item.requestMethod == null ? [] : item.requestMethod.split(','),
            })(
              <Select
                mode="multiple"
                placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                style={{ width: '100%' }}
              >
                <Select.Option value="GET">GET</Select.Option>
                <Select.Option value="POST">POST</Select.Option>
                <Select.Option value="PUT">PUT</Select.Option>
                <Select.Option value="DELETE">DELETE</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Col>
        <Col
          md={2}
          sm={24}
          style={index === 0 ? { lineHeight: '80px', top: '8px' } : { lineHeight: '55px', top: '-5px' }}
          key={`Col_2_${item.id}`}
        >
          {values.urls.length > 1 ? (
            <Icon style={{ fontSize: '22px', color: '#999' }} type="minus-circle-o" onClick={() => removeUrl(item)} />
          ) : (
            ''
          )}
        </Col>
      </Row>
    ));
  }

  return (
    <Modal
      width="720px"
      destroyOnClose
      maskClosable={false}
      title="设置URL"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      confirmLoading={loading}
    >
      <div>
        {formItems}
        <Row>
          <Col md={24} sm={24} style={{ padding: '0 8px' }}>
            <Button icon="plus" onClick={addUrl}>
              添加URL
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
});

@connect(({ sysMenu, loading }) => ({
  sysMenu,
  loading: loading.models.sysMenu,
}))
@Form.create()
class Menu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      formValues: {},
      modalUrlVisible: false,
      formUrlValues: [],
    };
    this.columns = [
      {
        title: '菜单编码',
        dataIndex: 'code',
      },
      {
        title: '菜单名称',
        dataIndex: 'name',
      },
      {
        title: '菜单名称拼音',
        dataIndex: 'namePy',
      },
      {
        title: '节点类型',
        dataIndex: 'nodeType',
        render: nodeType => {
          let str = '';
          if (nodeType === 'PAGE') {
            str = '页面';
          } else if (nodeType === 'FUNC') {
            str = '功能';
          } else {
            str = '路径';
          }
          return str;
        },
      },
      {
        title: '菜单名称简称',
        dataIndex: 'nameAbs',
      },
      {
        title: '路由地址',
        dataIndex: 'path',
      },
      {
        title: '图标',
        dataIndex: 'icon',
      },
      {
        title: '序号',
        dataIndex: 'seqNum',
      },
      {
        title: '操作',
        render: (text, record) => (
          <span>
            <a onClick={() => this.handleModalVisible(true, record)}>
              <FormattedMessage id="app.form.btn.edit" />
            </a>
            {record.nodeType === 'PAGE' ? (
              <span>
                <Divider type="vertical" />
                <a onClick={() => this.handleModalUrlVisible(true, record)}>设置URL</a>
              </span>
            ) : (
              ''
            )}
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
      type: 'sysMenu/getMenus',
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
      type: 'sysMenu/getMenus',
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
    const {
      sysMenu: { tree },
    } = this.props;
    const { selectedRows } = this.state;
    const { list } = tree;
    const seqNum = this.getNextSeqNum(selectedRows, list);
    this.setState({
      modalVisible: !!flag,
      formValues: record || { seqNum },
    });
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (
      fields.id != null &&
      fields.nodeType === 'FUNC' &&
      (selectedRows.length === 0 || selectedRows[0].nodeType !== 'PAGE')
    ) {
      notification.error({
        message: '功能必须添加在页面下',
        description: '',
      });
      return;
    }
    if (
      fields.id != null &&
      fields.nodeType === 'PAGE' &&
      selectedRows.length !== 0 &&
      selectedRows[0].nodeType !== 'PATH'
    ) {
      notification.error({
        message: '页面必须添加在路径下',
        description: '',
      });
      return;
    }

    if (type === 'add') {
      let parentId = '0';
      if (selectedRows != null && selectedRows.length === 1) {
        parentId = selectedRows[0].id;
      }
      dispatch({
        type: 'sysMenu/addMenu',
        payload: { ...fields, parentId },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    } else {
      dispatch({
        type: 'sysMenu/editMenu',
        payload: { ...fields },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    }
  };

  // 删除事件
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysMenu/deleteMenu',
      payload: record.id,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.delete.success' }));
        this.handleRefresh(true);
      },
    });
  };

  // 取得下一个序号
  getNextSeqNum = (selectedRows, list) => {
    let seqNum = 0;
    if (selectedRows == null || selectedRows.length === 0) {
      if (list.length > 0) {
        seqNum = list[list.length - 1].seqNum + 1;
      } else {
        seqNum = 1;
      }
    } else {
      let flg = false;
      for (let i = 0; i < list.length; i += 1) {
        if (selectedRows[0].id === list[i].id) {
          const { children } = list[i];
          if (children != null && children.length > 0) {
            seqNum = children[children.length - 1].seqNum + 1;
          } else {
            seqNum = 1;
          }
          flg = true;
        }
      }
      if (!flg) {
        for (let i = 0; i < list.length; i += 1) {
          const { children } = list[i];
          if (children != null) {
            seqNum = this.getNextSeqNum(selectedRows, children);
            if (seqNum >= 1) {
              break;
            }
          }
        }
      }
    }
    return seqNum;
  };

  // 显示URL新增或编辑弹出框事件
  handleModalUrlVisible = (flag, record) => {
    const { dispatch } = this.props;
    if (flag) {
      dispatch({
        type: 'sysMenu/getMenuUrls',
        payload: { menuId: record.id },
        callback: menuUrls => {
          let newMenuUrls = [...menuUrls];
          if (newMenuUrls.length === 0) {
            newMenuUrls = [{ id: '0', url: '', requestMethod: null }];
          }
          this.setState({
            modalUrlVisible: !!flag,
            formUrlValues: { menuId: record.id, urls: newMenuUrls },
          });
        },
      });
    } else {
      this.setState({
        modalUrlVisible: !!flag,
        formUrlValues: {},
      });
    }
  };

  // URL新增或编辑保存
  handleUrlEdit = (fields, menuId) => {
    const { dispatch } = this.props;
    const params = [];
    Object.keys(fields.url).forEach(key => {
      const obj = {
        menuId,
        url: fields.url[key],
        requestMethod: fields.requestMethod[key].join(','),
      };
      params.push(obj);
    });
    dispatch({
      type: 'sysMenu/editMenuUrls',
      payload: { menuId, list: params },
      callback: () => {
        message.success(formatMessage({ id: 'app.form.submit.success' }));
        this.handleModalUrlVisible();
      },
    });
  };

  render() {
    const {
      sysMenu: { tree },
      loading,
    } = this.props;
    const { selectedRowKeys, selectedRows, modalVisible, formValues, modalUrlVisible, formUrlValues } = this.state;

    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      loading,
    };
    const parentUrlMethods = {
      handleEdit: this.handleUrlEdit,
      handleModalVisible: this.handleModalUrlVisible,
      loading,
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.handleSelectRows,
    };

    return (
      <PageHeaderWrapper title="菜单管理" hiddenBreadcrumb>
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
        <EditUrlForm {...parentUrlMethods} modalVisible={modalUrlVisible} values={formUrlValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Menu;
