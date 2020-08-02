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
	 celcius,
	 hourly,
	 size,
	 className }) => {
	const classProps = cx(styles, {
		[styles[`des--${size}`]]: true, [className]: className !== null
	})
	return (
		<>
			<div className={styles['list-group']}>
				{tempData.map((value, index) => {
					return (
					    <div key={index} className={styles['list-group-item']}>
							<div className={styles['condition-icons']}>
								<div className={styles['img']}><img alt="icon" src={dailyIcon[index]} /></div>
								<div className={classProps}><span>{dailyIconDesc[index]}</span></div>
							</div>
							<div className={styles['condition-values']}>
								<div>
									<div className={styles['days']}>{value}{' '}{hourly[index]}</div>

									<div className={classProps}>{celcius ? tempCel[index] : tempFar[index]}°</div>
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
	children: PropTypes.node.isRequired,
	size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
	className: PropTypes.string
}
export default Temperatures
