import React from 'react';
import PropTypes from 'prop-types';
import Logo from '../../assets/images/logo.png'
import styles from './Header.module.scss'


const Header = ({ currentTemp }) => {
	return (
		<div className={styles['header']}>
			<div className={styles['header-logo']}>
				<img src={Logo} className={styles['logo']}/>
			</div>
			<div className={styles['header-text']}>
				<h3>WHETHER FORECAST APP</h3>
			</div>
			<div className={styles['header-temp']}>
				{currentTemp < 15 ?
					'Below 15 C' :
					'Over 25 C'
				}
			</div>
		</div>
	)
}

Header.propTypes = {
	currentTemp: PropTypes.string.isRequired
}

export default Header
