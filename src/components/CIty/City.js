import React from 'react';
import styles from './City.module.scss'
import PropTypes from 'prop-types'

const City = ({
	  currentWeatherIcon,
	  weatherDescription,
	  currentTempCelci,
	  currentTempFa,
	  currentDate,
	  celsius }) => {
	return (
		<>
			<div className={`card ${styles['current-condition']}`}>
				<div className="present-left">
					<div className="row diff-item">
						<span className="date-f">{currentDate}</span>
					</div>
					<div className="vl">
						<img className="big-snow responsive" alt="icon" src={currentWeatherIcon} />
					</div>
					<div>
						<span className="big-season">{weatherDescription}</span>
					</div>
					<div className="center-temper">
						<span className="temperature">{!celsius ? currentTempCelci : currentTempFa}</span>
						<span>{!celsius ? '°C' : '°F'}</span>
					</div>
				</div>
			</div>
		</>
	)
}


City.propTypes = {
	currentWeatherIcon: PropTypes.string.isRequired,
	weatherDescription: PropTypes.string.isRequired,
	currentTempCelci: PropTypes.string.isRequired,
	currentTempFa: PropTypes.string.isRequired,
	currentDate: PropTypes.string.isRequired,
	celsius: PropTypes.bool.isRequired
}
export default City
