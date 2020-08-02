import React from 'react'
import styles from './Alert.module.scss'
import PropTypes from 'prop-types'
import cx from 'classnames'

const Alert = ({ message, type }) => {
	return (
		<div className={cx(styles['alert'], styles[`alert-${type}`])}>
			<strong>Warning</strong> - {message}
		</div>
	)
}

Alert.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
}
export default Alert
