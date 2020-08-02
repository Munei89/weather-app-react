import React from 'react';
import styles from './Tempratures.module.scss'
import cx from 'classnames'
import PropTypes from 'prop-types'

const Temperatures = ({
	 tempData,
	 dailyIcon,
	 dailyIconDesc,
	 tempCel,
	 tempFar,
	 celsius,
	 hourly,
	 size,
	isDay,
	 className }) => {
	const classProps = cx(styles, {
		[styles[`des--${size}`]]: true, [className]: className !== null
	})
	return (
		<>
			<div className={`${styles['list-group']} card`}>
				{tempData.map((value, index) => {
					return (
					    <div key={index} className={styles['list-group-item']}>
							<div className={styles['condition-icons']}>
								<div className={styles['img']}><img alt="icon" src={dailyIcon[index]} /></div>
								<div className={classProps}><span>{dailyIconDesc[index]}</span></div>
							</div>
							<div className={styles['condition-values']}>
								<div>
									<div className={classProps}>{value}{' '}{hourly[index]}</div>

									<div className={classProps}>{!celsius ? tempCel[index] : tempFar[index]}°</div>
								</div>
							</div>
						</div>)
				})}
			</div>
		</>
	);
}
Temperatures.defaultProps = {
	size: 'md',
	classNames: null
}
Temperatures.propTypes = {
	size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
	className: PropTypes.string,
	tempData: PropTypes.array.isRequired,
	dailyIcon: PropTypes.array.isRequired,
	dailyIconDesc: PropTypes.array.isRequired,
	tempCel: PropTypes.array.isRequired,
	tempFar: PropTypes.array.isRequired,
	celsius: PropTypes.bool.isRequired,
	hourly: PropTypes.array.isRequired,
	isDay: PropTypes.bool.isRequired
}
export default Temperatures
