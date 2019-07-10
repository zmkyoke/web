import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Exception } from '@/modules/platform-core';

const Exception500 = () => (
  <Exception
    type="500"
    desc={formatMessage({ id: 'platform.core.exception.description.500' })}
    linkElement={Link}
    backText={formatMessage({ id: 'platform.core.exception.back' })}
  />
);

export default Exception500;
