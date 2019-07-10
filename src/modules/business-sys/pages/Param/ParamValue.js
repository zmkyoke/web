import React, { PureComponent } from 'react';
import { Button, Form, Input, Menu, Checkbox, Select, InputNumber, message } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { PageHeaderWrapper, GridContent } from '@/modules/platform-core';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

@connect(({ sysParamValue, loading }) => ({
  sysParamValue,
  loading: loading.models.sysParamValue,
}))
@Form.create()
class ParamValue extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectKey: '',
      selectItems: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'sysParamValue/getParamItems',
    });
    dispatch({
      type: 'sysParamValue/getParamValues',
    });
  }

  // 菜单选择事件
  handleMenuSelect = menu => {
    this.setState({
      selectKey: menu.key,
    });
    this.handleRefresh(menu.key);
  };

  // 刷新事件
  handleRefresh = id => {
    const {
      dispatch,
      sysParamValue: { items },
    } = this.props;
    const selectItems = [];
    const dicTypeCodes = [];
    items.forEach(item => {
      if (item.parentId === id) {
        selectItems.push({ ...item });
        if (item.dicTypeCode != null && item.dicTypeCode !== '') {
          dicTypeCodes.push(item.dicTypeCode);
        }
      }
    });
    if (dicTypeCodes.length > 0) {
      dispatch({
        type: 'sysParamValue/getDictionaryBatchItems',
        payload: { typeCodes: dicTypeCodes.join(',') },
        callback: () => {
          this.setState({
            selectItems,
          });
        },
      });
    } else {
      this.setState({
        selectItems,
      });
    }
  };

  // 表单提交
  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        dispatch({
          type: 'sysParamValue/editParamValues',
          payload: values,
          callback: () => {
            message.success(formatMessage({ id: 'app.form.submit.success' }));
            dispatch({
              type: 'sysParamValue/getParamValues',
            });
          },
        });
      }
    });
  };

  // 下拉菜单选项
  renderSelectOption(item) {
    const {
      sysParamValue: { dictionaries },
    } = this.props;

    if (dictionaries[item.dicTypeCode] != null) {
      return dictionaries[item.dicTypeCode].map(itemDic => (
        <Select.Option key={`${item.itemCode}_${itemDic.itemCode}`} value={itemDic.itemCode}>
          {itemDic.itemName}
        </Select.Option>
      ));
    }

    return '';
  }

  // 生成菜单树
  renderTreeNodes = tree =>
    tree.map(item => {
      if (item.children) {
        return (
          <Menu.SubMenu title={item.itemName} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </Menu.SubMenu>
        );
      }
      return <Menu.Item key={item.id}>{item.itemName}</Menu.Item>;
    });

  // 生成表单
  renderForm = item => {
    const {
      sysParamValue: { paramValues },
      form,
    } = this.props;
    if (item.inputMode === 'INP') {
      if (item.inputType === 'STR') {
        return (
          <Form.Item {...formItemLayout} label={item.itemName} key={item.itemCode}>
            {form.getFieldDecorator(`${item.itemCode}`, {
              initialValue: paramValues[item.itemCode],
              rules: [
                { required: true, message: formatMessage({ id: 'app.validation.required' }) },
              ],
            })(<Input style={{ width: '150px' }} />)}
            <span className="phip-form-describe">{item.describe}</span>
          </Form.Item>
        );
      }
      if (item.inputType === 'NUM' || item.inputType === 'INT') {
        return (
          <Form.Item {...formItemLayout} label={item.itemName} key={item.itemCode}>
            {form.getFieldDecorator(`${item.itemCode}`, {
              initialValue: paramValues[item.itemCode],
              rules: [
                { required: true, message: formatMessage({ id: 'app.validation.required' }) },
              ],
            })(
              <InputNumber
                style={{ width: '150px' }}
                precision={item.inputType === 'INT' ? 0 : null}
              />
            )}
            <span className="phip-form-describe">{item.describe}</span>
          </Form.Item>
        );
      }
    }
    if (item.inputMode === 'CHE') {
      return (
        <Form.Item {...formItemLayout} label={item.itemName} key={item.itemCode}>
          {form.getFieldDecorator(`${item.itemCode}`, {
            initialValue: paramValues[item.itemCode] === 'true',
          })(<Checkbox defaultChecked={paramValues[item.itemCode] === 'true'} />)}
          <span className="phip-form-describe">{item.describe}</span>
        </Form.Item>
      );
    }
    if (item.inputMode === 'DIC') {
      return (
        <Form.Item {...formItemLayout} label={item.itemName} key={item.itemCode}>
          {form.getFieldDecorator(`${item.itemCode}`, {
            initialValue: paramValues[item.itemCode],
            rules: [{ required: true, message: formatMessage({ id: 'app.validation.required' }) }],
          })(
            <Select
              style={{ width: '150px' }}
              placeholder={formatMessage({ id: 'app.form.input.please-select' })}
            >
              {this.renderSelectOption(item)}
            </Select>
          )}
          <span className="phip-form-describe">{item.describe}</span>
        </Form.Item>
      );
    }
    return '';
  };

  render() {
    const {
      sysParamValue: { tree },
      loading,
    } = this.props;
    const { selectKey, selectItems } = this.state;

    return (
      <PageHeaderWrapper title="参数设置" hiddenBreadcrumb>
        <GridContent>
          <div className="phip-menu-lr-main">
            <div className="phip-menu-lr-main-left">
              <Menu mode="inline" selectedKeys={[selectKey]} onClick={this.handleMenuSelect}>
                {tree != null && tree.length > 0 ? this.renderTreeNodes(tree) : ''}
              </Menu>
            </div>
            <div className="phip-menu-lr-main-right">
              <div style={{ marginBottom: '16px' }}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => this.handleSubmit()}
                  disabled={selectKey == null || selectKey === ''}
                  loading={loading}
                >
                  <FormattedMessage id="app.form.btn.submit" />
                </Button>
              </div>
              <Form layout="horizontal">
                {selectItems != null && selectItems.length > 0
                  ? selectItems.map(item => this.renderForm(item))
                  : ''}
              </Form>
            </div>
          </div>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}

export default ParamValue;
