import React from 'react';

const City = ({ currentWeatherIcon,timeZone, weatherDescription, currentTempCelci, currentTempFa, currentDate, celcius }) => {
	return (
		<>
			<div className="row center diff-item">
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
						<span className="temperature">{celcius ? currentTempCelci : currentTempFa}</span>
					</div>
					<div className="temper-switch">
						<span>{celcius ? '°C' : '°F'}&nbsp;</span>&nbsp;
					</div>
				</div>
			</div>
			<div className="row diff-item">
				<span className="date-f">{currentDate}</span>
			</div>
			<div className="row diff-item">
				<span className="town-f">{timeZone}</span>
			</div>
		</>
	)
}

export default City
