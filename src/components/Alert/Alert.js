import React from 'react'
import styles from './Alert.module.scss'
import cx from 'classnames'

const Alert = ({ message, type }) => {
	return (
		<div className={cx(styles['alert'], styles[`alert-${type}`])}>
			<strong>Warning</strong> - {message}
		</div>
	)
}

export default Alert
