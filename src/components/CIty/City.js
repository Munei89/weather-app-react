import React from 'react';
import styles from './City.module.scss'

const City = ({
	  currentWeatherIcon,
	  weatherDescription,
	  currentTempCelci,
	  currentTempFa,
	  currentDate,
	  isDay,
	  celcius }) => {
	return (
		<>
			<div className={`card ${styles['current-condition']}`}>
				<div className="present-left">
					<div className="vl">
						<img className="big-snow responsive" alt="icon" src={currentWeatherIcon} />
					</div>
					<div>
						<span className="big-season">{weatherDescription}</span>
					</div>
				</div>

				<div className="present-right">
					<div className="center-temper">
						<span className="temperature">{!celcius ? currentTempCelci : currentTempFa}</span>
					</div>
					<div className="temper-switch">
						<span>{!celcius ? '°C' : '°F'}&nbsp;</span>&nbsp;
					</div>
				</div>
				<div className="row diff-item">
					<span className="date-f">{currentDate}</span>
				</div>
			</div>
		</>
	)
}

export default City
