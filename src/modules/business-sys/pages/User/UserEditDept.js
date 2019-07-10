import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Divider,
  Popconfirm,
  Checkbox,
  Form,
  Select,
  TreeSelect,
  notification,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';

@connect(({ sysUser }) => ({
  sysUser,
}))
@Form.create()
class UserEditDept extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysUser/getCompanys',
    });
    dispatch({
      type: 'sysUser/getRegions',
    });
    dispatch({
      type: 'sysUser/getDepts',
    });
  }

  // 新增事件
  handleAdd = () => {
    const { data } = this.state;
    this.index += 1;
    const newData = [...data];
    newData.push({
      id: `NEW_TEMP_ID_${this.index}`,
      userId: '',
      companyId: '',
      companyName: '',
      regionId: '',
      regionName: '',
      deptId: '',
      deptName: '',
      mainFlg: '0',
      leaderFlg: '0',
      editable: true,
      isNew: true,
    });
    this.setState({ data: newData });
  };

  // 编辑事件
  handleEdit = record => {
    const { data } = this.state;
    const newData = [...data];
    const target = newData.filter(item => item.id === record.id)[0];
    if (target) {
      if (!target.editable) {
        this.cacheOriginData[record.id] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  // 删除事件
  handleDelete = record => {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.id !== record.id);
    this.setState({ data: newData });
    onChange(newData);
  };

  // 取消事件
  handleCancel = record => {
    if (record.isNew) {
      this.handleDelete(record);
    } else {
      const { data } = this.state;
      const newData = [...data];
      const target = newData.filter(item => item.id === record.id)[0];
      if (this.cacheOriginData[record.id]) {
        Object.assign(target, this.cacheOriginData[record.id]);
        delete this.cacheOriginData[record.id];
      }
      target.editable = false;
      this.setState({ data: newData });
    }
  };

  // 保存事件
  handleSave = record => {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = [...data];
    const target = newData.filter(item => item.id === record.id)[0];
    if (target) {
      if (target.companyId === '') {
        notification.error({
          message: '机构不能为空！',
          description: '',
        });
        return;
      }
      if (target.isNew) {
        delete target.isNew;
      }
      if (this.cacheOriginData[record.id]) {
        delete this.cacheOriginData[record.id];
      }
      target.editable = false;
      this.setState({ data: newData });
      onChange(newData);
    }
  };

  // 表单项变更
  handleFieldChange = (e, record, fieldName, option) => {
    const { data } = this.state;
    const newData = [...data];
    const target = newData.filter(item => item.id === record.id)[0];
    if (target) {
      let fieldValue = '';
      if (fieldName === 'companyId') {
        fieldValue = e;
        target.companyName = option.props.children;
        target.regionId = '';
        target.regionName = '';
        target.deptId = '';
        target.deptName = '';
      }
      if (fieldName === 'regionId') {
        fieldValue = e;
        target.regionName = option ? option.props.children : '';
        target.deptId = '';
        target.deptName = '';
      }
      if (fieldName === 'deptId') {
        fieldValue = e;
        target.deptName = option ? option[0] : '';
      }
      if (fieldName === 'mainFlg' || fieldName === 'leaderFlg') {
        if (e.target.checked) {
          fieldValue = '1';
        } else {
          fieldValue = '0';
        }
      }
      target[fieldName] = fieldValue;
      this.setState({ data: newData });
    }
  };

  // 下拉菜单选项
  renderSelectOption(type, id) {
    const {
      sysUser: { companies, regions, depts },
    } = this.props;

    if (type === 'COMPANY') {
      return companies.map(item => (
        <Select.Option key={`Company_${item.id}`} value={item.id}>
          {item.name}
        </Select.Option>
      ));
    }
    if (type === 'REGION') {
      return regions
        .filter(item => item.companyId === id)
        .map(item => (
          <Select.Option key={`Region_${item.id}`} value={item.id}>
            {item.regionName}
          </Select.Option>
        ));
    }
    if (type === 'DEPT') {
      return depts
        .filter(item => item.companyRegionId === id)
        .map(item => {
          if (item.children) {
            return (
              <TreeSelect.TreeNode value={item.id} title={item.deptName} key={`Dept_${item.id}`}>
                {this.renderTreeNodes(item.children)}
              </TreeSelect.TreeNode>
            );
          }
          return (
            <TreeSelect.TreeNode value={item.id} title={item.deptName} key={`Dept_${item.id}`} />
          );
        });
    }
    return '';
  }

  // 生成树
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeSelect.TreeNode value={item.id} title={item.deptName} key={`Dept_${item.id}`}>
            {this.renderTreeNodes(item.children)}
          </TreeSelect.TreeNode>
        );
      }
      return <TreeSelect.TreeNode value={item.id} title={item.deptName} key={`Dept_${item.id}`} />;
    });

  render() {
    const { data } = this.state;

    const columns = [
      {
        title: '机构',
        dataIndex: 'companyName',
        render: (companyName, record) => {
          if (record.editable) {
            return (
              <Select
                size="small"
                style={{ width: '200px' }}
                value={record.companyId}
                onChange={(e, option) => this.handleFieldChange(e, record, 'companyId', option)}
                placeholder={formatMessage({ id: 'app.form.input.please-select' })}
              >
                {this.renderSelectOption('COMPANY')}
              </Select>
            );
          }
          return companyName;
        },
      },
      {
        title: '分支机构',
        dataIndex: 'regionName',
        render: (regionName, record) => {
          if (record.editable) {
            return (
              <Select
                size="small"
                allowClear
                style={{ width: '200px' }}
                value={record.regionId}
                onChange={(e, option) => this.handleFieldChange(e, record, 'regionId', option)}
                placeholder={formatMessage({ id: 'app.form.input.please-select' })}
              >
                {this.renderSelectOption('REGION', record.companyId)}
              </Select>
            );
          }
          return regionName;
        },
      },
      {
        title: '科室',
        dataIndex: 'deptName',
        render: (deptName, record) => {
          if (record.editable) {
            return (
              <TreeSelect
                size="small"
                allowClear
                treeDefaultExpandAll
                style={{ width: '200px' }}
                dropdownStyle={{ maxHeight: '400px', overflow: 'auto' }}
                value={record.deptId}
                onChange={(e, option) => this.handleFieldChange(e, record, 'deptId', option)}
                placeholder={formatMessage({ id: 'app.form.input.please-select' })}
              >
                {this.renderSelectOption(
                  'DEPT',
                  record.regionId ? record.regionId : record.companyId
                )}
              </TreeSelect>
            );
          }
          return deptName;
        },
      },
      {
        title: '主岗',
        dataIndex: 'mainFlg',
        render: (mainFlg, record) => {
          if (record.editable) {
            return (
              <Checkbox
                defaultChecked={mainFlg === '1'}
                onChange={e => this.handleFieldChange(e, record, 'mainFlg')}
              />
            );
          }
          if (mainFlg === '1') {
            return '是';
          }
          return '否';
        },
      },
      {
        title: '科室负责人',
        dataIndex: 'leaderFlg',
        render: (leaderFlg, record) => {
          if (record.editable) {
            return (
              <Checkbox
                defaultChecked={leaderFlg === '1'}
                onChange={e => this.handleFieldChange(e, record, 'leaderFlg')}
              />
            );
          }
          if (leaderFlg === '1') {
            return '是';
          }
          return '否';
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.editable) {
            return (
              <span>
                <a onClick={() => this.handleSave(record)}>
                  <FormattedMessage id="app.form.btn.save" />
                </a>
                <Divider type="vertical" />
                <a onClick={() => this.handleCancel(record)}>
                  <FormattedMessage id="app.form.btn.cancel" />
                </a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={() => this.handleEdit(record)}>
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
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table rowKey="id" size="middle" columns={columns} dataSource={data} pagination={false} />
        <Button icon="plus" type="dashed" onClick={this.handleAdd} className="phip-form-table-add">
          <FormattedMessage id="app.form.btn.add" />
        </Button>
      </Fragment>
    );
  }
}

export default UserEditDept;
