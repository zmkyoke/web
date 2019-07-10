import React, { PureComponent } from 'react';
import {
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Popconfirm,
  InputNumber,
  Row,
  Col,
  Card,
  Tree,
} from 'antd';
import { connect } from 'dva';
import { FormattedMessage, formatMessage } from 'umi/locale';
import { PageHeaderWrapper, GridContent, StandardTable } from '@/modules/platform-core';

// 新增或编辑弹出框
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  let title = '新增科室';
  if (values.id != null) {
    title = '编辑科室';
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
      <Form.Item label="科室编码">
        {form.getFieldDecorator('deptCode', {
          initialValue: values.deptCode,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input disabled={!!values.id} />)}
      </Form.Item>
      <Form.Item label="科室名称">
        {form.getFieldDecorator('deptName', {
          initialValue: values.deptName,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
        })(<Input />)}
      </Form.Item>
      <Form.Item label="科室名称拼音">
        {form.getFieldDecorator('deptNamePy', {
          initialValue: values.deptNamePy,
        })(<Input />)}
      </Form.Item>
      <Form.Item label="科室简称">
        {form.getFieldDecorator('deptNameAbs', {
          initialValue: values.deptNameAbs,
          rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
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

@connect(({ sysDept, loading }) => ({
  sysDept,
  loading: loading.models.sysDept,
}))
@Form.create()
class Dept extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '',
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      formValues: {},
    };
    this.columns = [
      {
        title: '科室编码',
        dataIndex: 'deptCode',
      },
      {
        title: '科室名称',
        dataIndex: 'deptName',
      },
      {
        title: '科室名称拼音',
        dataIndex: 'deptNamePy',
      },
      {
        title: '科室简称',
        dataIndex: 'deptNameAbs',
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
      type: 'sysDept/getCompanies',
    });
    dispatch({
      type: 'sysDept/getRegions',
    });
    dispatch({
      type: 'sysDept/getDepts',
      payload: { companyRegionId: '' },
    });
  }

  // 机构选择事件
  handleTreeSelect = keys => {
    if (keys.length === 1) {
      this.setState({
        selectKey: keys[0],
      });
      this.handleRefresh(keys[0], true);
    } else {
      this.setState({
        selectKey: '',
      });
      this.handleRefresh('', true);
    }
  };

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

  // 科室列表刷新事件
  handleRefresh = (selectKey, clearSelected) => {
    const { dispatch } = this.props;
    const params = {
      companyRegionId: selectKey,
    };
    dispatch({
      type: 'sysDept/getDepts',
      payload: params,
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
      sysDept: { tree },
    } = this.props;
    const { selectKey, selectedRows } = this.state;
    if (selectKey === '') {
      notification.error({
        message: '请先选择对应机构',
        description: '',
      });
      return;
    }
    if (selectedRows != null && selectedRows.length > 1) {
      notification.error({
        message: '请先选择一个上级科室',
        description: '',
      });
      return;
    }
    const { list } = tree;
    const seqNum = this.getNextSeqNum(selectedRows, list);
    this.setState({
      modalVisible: !!flag,
      formValues: record || { seqNum },
    });
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const {
      sysDept: { companies },
      dispatch,
    } = this.props;
    const { selectKey, selectedRows } = this.state;
    if (type === 'add') {
      let parentType = 'REG';
      for (let i = 0; i < companies.length; i += 1) {
        if (selectKey === companies[i].id) {
          parentType = 'COM';
          break;
        }
      }
      let parentId = '0';
      if (selectedRows != null && selectedRows.length === 1) {
        parentId = selectedRows[0].id;
      }
      dispatch({
        type: 'sysDept/addDept',
        payload: { ...fields, companyRegionId: selectKey, parentId, parentType },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh(selectKey);
        },
      });
    } else {
      dispatch({
        type: 'sysDept/editDept',
        payload: { ...fields },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh(selectKey);
        },
      });
    }
  };

  // 删除事件
  handleDelete = record => {
    const { dispatch } = this.props;
    const { selectKey } = this.state;
    dispatch({
      type: 'sysDept/deleteDept',
      payload: record.id,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.delete.success' }));
        this.handleRefresh(selectKey, true);
      },
    });
  };

  // 生成菜单树
  renderTreeNodes = (data, type) =>
    data.map(item => {
      if (item.children) {
        return (
          <Tree.TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children, 'REG')}
          </Tree.TreeNode>
        );
      }
      if (type === 'REG') {
        return <Tree.TreeNode title={item.regionName} key={item.id} />;
      }
      return <Tree.TreeNode title={item.name} key={item.id} />;
    });

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

  render() {
    const {
      sysDept: { companies, regions, tree },
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

    for (let i = 0; i < companies.length; i += 1) {
      const regionTmps = [];
      for (let j = 0; j < regions.length; j += 1) {
        if (companies[i].id === regions[j].companyId) {
          regionTmps.push(regions[j]);
        }
      }
      companies[i].children = regionTmps;
    }

    return (
      <PageHeaderWrapper title="科室管理" hiddenBreadcrumb>
        <GridContent>
          <Row gutter={8}>
            <Col lg={5} md={24}>
              <Card bordered={false}>
                {companies != null && companies.length > 0 ? (
                  <Tree showLine onSelect={this.handleTreeSelect}>
                    {this.renderTreeNodes(companies)}
                  </Tree>
                ) : (
                  ''
                )}
              </Card>
            </Col>
            <Col lg={19} md={24}>
              <Card bordered={false}>
                <div className="phip-table">
                  <div className="phip-table-operator">
                    <Button
                      icon="plus"
                      type="primary"
                      onClick={() => this.handleModalVisible(true)}
                    >
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
            </Col>
          </Row>
        </GridContent>
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Dept;
