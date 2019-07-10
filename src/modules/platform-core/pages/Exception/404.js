import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from '@/modules/platform-core';

const Exception404 = () => (
  <Exception
    type="404"
    desc={formatMessage({ id: 'platform.core.exception.description.404' })}
    linkElement={Link}
    backText={formatMessage({ id: 'platform.core.exception.back' })}
  />
);

export default Exception404;
