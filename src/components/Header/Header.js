import React from 'react';
import Logo from '../../assets/images/logo.png'
import styles from './Header.module.scss'


const Header = () => {
	return (
		<div className={styles['header']}>
			<div className={styles['header-logo']}>
				<img src={Logo} className={styles['logo']}/>
			</div>
			<div className={styles['header-text']}>
				<h3>WHETHER FORECAST APP </h3>
			</div>
			<div className={styles['header-temp']}>
				Cape Town
			</div>
		</div>
	)
}

export default Header
