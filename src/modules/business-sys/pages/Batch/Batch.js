import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  Divider,
  Popconfirm,
  message,
  Card,
  Button,
  Select,
  Col,
  Row,
  InputNumber,
  TimePicker,
  Badge,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, StandardTable } from '@/modules/platform-core';

// 新增或编辑弹出框
let id = 0;
const EditForm = Form.create()(props => {
  const { modalVisible, form, handleEdit, handleModalVisible, values, loading } = props;
  form.getFieldDecorator('keys', { initialValue: 0 });
  let title = '新增批处理';
  if (values.id != null) {
    title = '编辑批处理';
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
      <Row gutter={16}>
        <Col md={24} sm={24}>
          <Form.Item label="批次编码">
            {form.getFieldDecorator('code', {
              initialValue: values.code,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(<Input disabled={!!values.id} />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={24} sm={24}>
          <Form.Item label="批次名称">
            {form.getFieldDecorator('name', {
              initialValue: values.name,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={24} sm={24}>
          <Form.Item label="批次程序">
            {form.getFieldDecorator('program', {
              initialValue: values.program,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(<Input />)}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col md={24} sm={24}>
          <Form.Item label="批次类型">
            {form.getFieldDecorator('type', {
              initialValue: values.type,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(
              <Select
                disabled={!!values.id}
                placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                style={{ width: '110px' }}
                onChange={e => handleFieldChange(e, 'type')}
              >
                <Select.Option value="1">固定时间</Select.Option>
                <Select.Option value="2">间隔时间</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
      {values != null && values.type === '1' ? (
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="批次时间">
              {form.getFieldDecorator('fixedType', {
                initialValue: values.fixedType,
                rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
              })(
                <Select
                  placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                  style={{ width: '110px' }}
                  onChange={e => handleFieldChange(e, 'fixedType')}
                >
                  <Select.Option value="DAY">每天</Select.Option>
                  <Select.Option value="WEEK">每周</Select.Option>
                  <Select.Option value="MONTH">每月</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          {values != null && values.fixedType === 'WEEK' ? (
            <Col md={6} sm={24}>
              <Form.Item label=" " colon={false}>
                {form.getFieldDecorator('fixedDay', {
                  initialValue: values.fixedDay,
                  rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
                })(
                  <Select
                    placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                    style={{ width: '110px' }}
                  >
                    <Select.Option value="MON">星期一</Select.Option>
                    <Select.Option value="TUE">星期二</Select.Option>
                    <Select.Option value="WED">星期三</Select.Option>
                    <Select.Option value="THU">星期四</Select.Option>
                    <Select.Option value="FRI">星期五</Select.Option>
                    <Select.Option value="SAT">星期六</Select.Option>
                    <Select.Option value="SUN">星期日</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          ) : (
            ''
          )}
          {values != null && values.fixedType === 'MONTH' ? (
            <Col md={6} sm={24}>
              <Form.Item label=" " colon={false}>
                {form.getFieldDecorator('fixedDay', {
                  initialValue: values.fixedDay,
                  rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
                })(
                  <Select
                    placeholder={formatMessage({ id: 'app.form.input.please-select' })}
                    style={{ width: '110px' }}
                  >
                    <Select.Option value="1">1日</Select.Option>
                    <Select.Option value="2">2日</Select.Option>
                    <Select.Option value="3">3日</Select.Option>
                    <Select.Option value="4">4日</Select.Option>
                    <Select.Option value="5">5日</Select.Option>
                    <Select.Option value="6">6日</Select.Option>
                    <Select.Option value="7">7日</Select.Option>
                    <Select.Option value="8">8日</Select.Option>
                    <Select.Option value="9">9日</Select.Option>
                    <Select.Option value="10">10日</Select.Option>
                    <Select.Option value="11">11日</Select.Option>
                    <Select.Option value="12">12日</Select.Option>
                    <Select.Option value="13">13日</Select.Option>
                    <Select.Option value="14">14日</Select.Option>
                    <Select.Option value="15">15日</Select.Option>
                    <Select.Option value="16">16日</Select.Option>
                    <Select.Option value="17">17日</Select.Option>
                    <Select.Option value="18">18日</Select.Option>
                    <Select.Option value="19">19日</Select.Option>
                    <Select.Option value="20">20日</Select.Option>
                    <Select.Option value="21">21日</Select.Option>
                    <Select.Option value="22">22日</Select.Option>
                    <Select.Option value="23">23日</Select.Option>
                    <Select.Option value="24">24日</Select.Option>
                    <Select.Option value="25">25日</Select.Option>
                    <Select.Option value="26">26日</Select.Option>
                    <Select.Option value="27">27日</Select.Option>
                    <Select.Option value="28">28日</Select.Option>
                    <Select.Option value="29">29日</Select.Option>
                    <Select.Option value="30">30日</Select.Option>
                    <Select.Option value="31">31日</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          ) : (
            ''
          )}
          <Col md={12} sm={24}>
            <Form.Item label=" " colon={false}>
              {form.getFieldDecorator('fixedTime', {
                initialValue: values.fixedTime ? moment(values.fixedTime, 'HH:mm:ss') : null,
                rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
              })(<TimePicker />)}
            </Form.Item>
          </Col>
        </Row>
      ) : (
        ''
      )}
      {values != null && values.type === '2' ? (
        <Row gutter={16}>
          <Col md={6} sm={24}>
            <Form.Item label="批次时间">
              {form.getFieldDecorator('intervalTime', {
                initialValue: values.intervalTime,
                rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
              })(<InputNumber style={{ width: '100%' }} precision={0} />)}
            </Form.Item>
          </Col>
          <Col md={18} sm={24}>
            <Form.Item label=" " colon={false}>
              {form.getFieldDecorator('intervalType', {
                initialValue: values.intervalType,
                rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
              })(
                <Select placeholder={formatMessage({ id: 'app.form.input.please-select' })} style={{ width: '110px' }}>
                  <Select.Option value="SECOND">秒</Select.Option>
                  <Select.Option value="MINUE">分</Select.Option>
                  <Select.Option value="HOUR">小时</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      ) : (
        ''
      )}
      <Row gutter={16}>
        <Col md={24} sm={24}>
          <Form.Item label="状态">
            {form.getFieldDecorator('status', {
              initialValue: values.status,
              rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
            })(
              <Select placeholder={formatMessage({ id: 'app.form.input.please-select' })} style={{ width: '110px' }}>
                <Select.Option value="1">启用</Select.Option>
                <Select.Option value="0">停用</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ sysBatch, loading }) => ({
  sysBatch,
  loading:
    loading.effects['sysBatch/getBatchs'] ||
    loading.effects['sysBatch/execBatch'] ||
    loading.effects['sysBatch/addBatch'] ||
    loading.effects['sysBatch/editBatch'],
  logLoading: loading.effects['sysBatch/getBatchPageLogs'],
}))
@Form.create()
class Batch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      formValues: {},
      expandedRowKeys: [],
    };
    this.columns = [
      {
        title: '批次编码',
        dataIndex: 'code',
      },
      {
        title: '批次名称',
        dataIndex: 'name',
      },
      {
        title: '批次类型',
        dataIndex: 'type',
        render: type => {
          if (type === '1') {
            return '固定时间';
          }
          return '间隔时间';
        },
      },
      {
        title: '批次时间',
        dataIndex: 'fixedTime',
        render: (text, record) => {
          let str = '';
          if (record.type === '1') {
            switch (record.fixedType) {
              case 'DAY':
                str += '每天 ';
                break;
              case 'WEEK':
                str += '每周 ';
                if (record.fixedDay === 'MON') {
                  str += '星期一 ';
                }
                if (record.fixedDay === 'TUE') {
                  str += '星期二 ';
                }
                if (record.fixedDay === 'WED') {
                  str += '星期三 ';
                }
                if (record.fixedDay === 'THU') {
                  str += '星期四 ';
                }
                if (record.fixedDay === 'FRI') {
                  str += '星期五 ';
                }
                if (record.fixedDay === 'SAT') {
                  str += '星期六 ';
                }
                if (record.fixedDay === 'SUN') {
                  str += '星期日 ';
                }
                break;
              case 'MONTH':
                str = `${str}每月 ${record.fixedDay}日 `;
                break;
              default:
                break;
            }
            str += record.fixedTime;
          } else {
            str = record.intervalTime;
            switch (record.intervalType) {
              case 'SECOND':
                str += ' 秒';
                break;
              case 'MINUE':
                str += ' 分钟';
                break;
              case 'HOUR':
                str += ' 小时';
                break;
              default:
                break;
            }
          }
          return str;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: status => {
          if (status === '1') {
            return <Badge status="success" text="已启用" />;
          }
          return <Badge status="error" text="已停用" />;
        },
      },
      {
        title: '最后执行时间',
        dataIndex: 'lastExecTime',
      },
      {
        title: '最后执行结果',
        dataIndex: 'lastExecResult',
        render: (lastExecResult, record) => {
          if (lastExecResult === '1') {
            return <Badge status="success" text="成功" />;
          }
          if (lastExecResult === '0') {
            return <Badge status="error" text={`失败（${record.lastExecErrNum ? record.lastExecErrNum : ''}）`} />;
          }
          return '';
        },
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
            <Divider type="vertical" />
            <Popconfirm
              title={`${formatMessage({ id: 'app.form.sure.exec' })}`}
              onConfirm={() => this.handleExec(record)}
            >
              <a>
                <FormattedMessage id="app.form.btn.exec-hand" />
              </a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    this.logColumns = [
      {
        title: '启动时间',
        dataIndex: 'startTime',
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
      },
      {
        title: '执行结果',
        dataIndex: 'execResult',
        render: execResult => {
          if (execResult === '1') {
            return <Badge status="success" text="成功" />;
          }
          if (execResult === '0') {
            return <Badge status="error" text="失败" />;
          }
          return '';
        },
      },
      {
        title: '执行失败记录数',
        dataIndex: 'execErrNum',
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysBatch/getBatchs',
    });
  }

  // 删除事件
  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysBatch/deleteBatch',
      payload: record.id,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.delete.success' }));
        this.handleRefresh();
      },
    });
  };

  // 新增或编辑保存
  handleEdit = (type, fields) => {
    const { dispatch } = this.props;
    const { fixedTime, ...otherFields } = fields;

    let fixedTimeNew = null;
    if (fixedTime != null && fixedTime !== '') {
      fixedTimeNew = moment(fixedTime).format('HH:mm:ss');
    }

    if (type === 'add') {
      dispatch({
        type: 'sysBatch/addBatch',
        payload: { ...otherFields, fixedTime: fixedTimeNew },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    } else {
      dispatch({
        type: 'sysBatch/editBatch',
        payload: { ...otherFields, fixedTime: fixedTimeNew },
        callback: () => {
          message.success(formatMessage({ id: 'app.form.submit.success' }));
          this.handleModalVisible();
          this.handleRefresh();
        },
      });
    }
  };

  // 刷新事件
  handleRefresh = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'sysBatch/getBatchs',
    });
  };

  // 显示新增或编辑弹出框事件
  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      formValues: record || { type: '1', status: '0' },
    });
  };

  // 手动执行
  handleExec = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysBatch/execBatch',
      payload: record,
      callback: () => {
        message.success(formatMessage({ id: 'app.form.exec.success' }));
        this.handleRefresh();
      },
    });
  };

  // 列表变更事件
  handleStandardTableChange = (pagination, batchId) => {
    const { dispatch } = this.props;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      id: batchId,
    };

    dispatch({
      type: 'sysBatch/getBatchPageLogs',
      payload: params,
    });
  };

  // 查看批处理日志
  expandedRowRender = record => {
    const {
      sysBatch: { logs },
      logLoading,
    } = this.props;

    return (
      <StandardTable
        rowKey="id"
        size="small"
        columns={this.logColumns}
        data={logs[record.id]}
        rowSelection={null}
        loading={logLoading}
        selectedRows={[]}
        onChange={pagination => this.handleStandardTableChange(pagination, record.id)}
      />
    );
  };

  // 展开批处理日志事件
  onExpandedRowsChange = expandedRows => {
    const { dispatch } = this.props;
    const { expandedRowKeys } = this.state;

    let batchId = '';
    for (let i = 0; i < expandedRows.length; i += 1) {
      let flg = false;
      for (let j = 0; j < expandedRowKeys.length; j += 1) {
        if (expandedRows[i] === expandedRowKeys[j]) {
          flg = true;
          break;
        }
      }
      if (!flg) {
        batchId = expandedRows[i];
        break;
      }
    }

    if (batchId !== '') {
      dispatch({
        type: 'sysBatch/getBatchPageLogs',
        payload: { id: batchId },
      });
      this.setState({
        expandedRowKeys: [batchId],
      });
    } else if (expandedRows.length === 0) {
      this.setState({
        expandedRowKeys: [],
      });
    }
  };

  render() {
    const {
      sysBatch: { batchs },
      loading,
    } = this.props;
    const { modalVisible, formValues, expandedRowKeys } = this.state;

    const parentMethods = {
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
      loading,
    };

    return (
      <PageHeaderWrapper title="批处理" hiddenBreadcrumb>
        <Card bordered={false}>
          <div className="licx-table">
            <div className="licx-table-operator">
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                <FormattedMessage id="app.form.btn.add" />
              </Button>
            </div>
            <StandardTable
              rowKey="id"
              size="middle"
              loading={loading}
              data={batchs}
              columns={this.columns}
              rowSelection={null}
              selectedRows={[]}
              expandedRowRender={this.expandedRowRender}
              onExpandedRowsChange={this.onExpandedRowsChange}
              expandedRowKeys={expandedRowKeys}
              pagination={false}
            />
          </div>
        </Card>
        <EditForm {...parentMethods} modalVisible={modalVisible} values={formValues} />
      </PageHeaderWrapper>
    );
  }
}

export default Batch;
