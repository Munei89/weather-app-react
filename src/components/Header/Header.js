import React from 'react';
import PropTypes from 'prop-types';


const Header = ({ currentTemp = 20 }) => {
	return (
		<div className="grid-container">
			<div className='grid-row'>
				<div className="col" >
					{/*<a href="https://twitter.com/BreakingWeather" rel="noopener noreferrer" target="_blank"><img alt="icon" className="twitter" src="./twitter.svg" /></a>*/}
					{/*<a href="https://instagram.com" rel="noopener noreferrer" target="_blank"><img alt="icon" className="instagram" src="./instagram.svg" /></a>*/}
				</div>
				<div className="col">
					<h1>WHETHER FORECAST</h1>
				</div>
				<div className="col" >
					{currentTemp < 15 ?
						'Below 15 C' :
						'Over 25 C'
					}
				</div>
			</div>
		</div>
	)
}

Header.propTypes = {
	currentTemp: PropTypes.isRequired
}

export default Header
