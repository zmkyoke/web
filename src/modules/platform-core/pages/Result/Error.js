import React from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Card } from 'antd';
import { Result, PageHeaderWrapper } from '@/modules/platform-core';

const actions = (
  <Button type="primary">
    <FormattedMessage id="platform.core.result.error.btn-text" defaultMessage="Return to modify" />
  </Button>
);

export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Result
        type="error"
        title={formatMessage({ id: 'platform.core.result.error.title' })}
        description={formatMessage({ id: 'platform.core.result.error.description' })}
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
