import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from '@/modules/platform-core';

const Exception403 = () => (
  <Exception
    type="403"
    desc={formatMessage({ id: 'platform.core.exception.description.403' })}
    linkElement={Link}
    backText={formatMessage({ id: 'platform.core.exception.back' })}
  />
);

export default Exception403;
