import React from 'react';
import Link from 'umi/link';
import { FormattedMessage } from 'umi/locale';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';

const UserLayout = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.top}>
        <div className={styles.header}>
          <Link to="/">
            <img alt="logo" className={styles.logo} src={logo} />
            <span className={styles.title}>Ant Design</span>
          </Link>
        </div>
        <div className={styles.desc}>
          <FormattedMessage id="platform.home.login.subheading" />
        </div>
      </div>
      {children}
    </div>
  </div>
);

export default UserLayout;
