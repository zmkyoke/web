import React, { Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Button, Card } from 'antd';
import { Result, PageHeaderWrapper } from '@/modules/platform-core';

const actions = (
  <Fragment>
    <Button type="primary">
      <FormattedMessage
        id="platform.core.result.success.btn-return"
        defaultMessage="Back to list"
      />
    </Button>
    <Button>
      <FormattedMessage
        id="platform.core.result.success.btn-project"
        defaultMessage="View project"
      />
    </Button>
    <Button>
      <FormattedMessage id="platform.core.result.success.btn-print" defaultMessage="Print" />
    </Button>
  </Fragment>
);

export default () => (
  <PageHeaderWrapper>
    <Card bordered={false}>
      <Result
        type="success"
        title={formatMessage({ id: 'platform.core.result.success.title' })}
        description={formatMessage({ id: 'platform.core.result.success.description' })}
        actions={actions}
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    </Card>
  </PageHeaderWrapper>
);
