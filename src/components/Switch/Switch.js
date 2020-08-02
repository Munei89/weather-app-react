import React from 'react';
import styles from './Switch.module.scss'
import cx from 'classnames';
import PropTypes from 'prop-types'


const Switch = ({ checked, name, id, disabled, handleToggle, defaultChecked }) => {
	return (
		<>
			<label className={styles['switch']}>
				<input
					type="checkbox"
					checked={checked}
					onChange={handleToggle}
					disabled={disabled}
					name={id}
					id={id}
				/>
				<span className={cx(styles['slider'], styles['round'])}/>
			</label>
		</>
	)
}
Switch.defaultProps = {
	defaultChecked: false
}
Switch.propTypes = {
	defaultChecked: PropTypes.bool
}

export default Switch
