import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { backOff } from 'exponential-backoff';


const Weather = () => {
	const getWeather = useSelector(state => state.getWeather);
	const celcius = useSelector(state => state.getWeather.celci_flag)
	const inc_attemp = useSelector(state => state.getWeather);
	const [backoffsecond, setBackoffsecond] = useState(0);
	const [weatherReady, setWeatherReady] = useState(0);
	const [error, setError] = useState();
	const dispatch = useDispatch()


	async function fetchApi() {
		setBackoffsecond(new Date().getSeconds());
		return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=-33.924900&lon=18.424100&%20exclude=hourly,daily&appid=5d2a8fa8f4d1086adc783976721c0423')
			.then(response => {
				return response.json()
			})
		try {
			const response = await backOff(() => fetchApi(), { delayFirstAttempt: true, numOfAttempts: 11 - inc_attemp, timeMultiple: 3 });
			// process response
			dispatch({ type: 'GET_WEATHER', payload: response });
		} catch (e) {
			main_backoff();
			setError(true)
		}
	}
	async function main_backoff() {
		try {
			const response = await backOff(() => fetchApi(), { delayFirstAttempt: true, numOfAttempts: 11 - inc_attemp, timeMultiple: 3 });
			// process response
			console.log('api connection success===', response);
			dispatch({ type: 'GET_WEATHER', payload: response });
		} catch (e) {
			// handle error
			main_backoff();
			console.log('api connection error===');
		}
	}

	let date_array = [];
	let hourly_array = [];
	let temp_array_celcius = [];
	let temp_array_fare = [];
	let daily_icon_array = [];
	let daily_icon_des = [];
	let current_temp_celci;
	let current_temp_fa;
	let current_date = '';
	let current_weather_icon = 'http://openweathermap.org/img/wn/01d@2x.png';
	let current_weather_des = '';

	if (getWeather.status) {
		let current_dt = getWeather.weatherData.current.dt;
		const current_milliseconds = current_dt * 1000 // 1575909015000
		const current_dateObject = new Date(current_milliseconds)
		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		current_date = current_dateObject.toLocaleString('en-ZA', options);
		current_temp_celci = getWeather.weatherData.current.temp - 273.15;
		current_temp_fa = current_temp_celci * (9 / 5) + 32;
		current_temp_celci = current_temp_celci.toFixed(0);
		current_temp_fa = current_temp_fa.toFixed(0);

		current_weather_icon = 'http://openweathermap.org/img/wn/' + getWeather.weatherData.current.weather[0].icon + '@2x.png';
		current_weather_des = getWeather.weatherData.current.weather[0].main;

		let daily_temp = getWeather.weatherData.daily;
		let k = 0;
		daily_temp.forEach(element => {
			if (k === 0) {
				k = k + 1;
				return;
			}
			const milliseconds = element.dt * 1000
			const dateObject = new Date(milliseconds)
			let weekday = dateObject.toLocaleString('en-ZA', { weekday: 'long' }) // Monday
			dateObject.toLocaleString('en-ZA', { hour: 'numeric' }) // 10 AM
			dateObject.toLocaleString('en-ZA', { minute: 'numeric' }) // 30

			let temp_kelvin = element.temp.day;
			let temp_celcius = temp_kelvin - 273.15;
			let temp_fa = temp_celcius * (9 / 5) + 32;

			daily_icon_array.push('http://openweathermap.org/img/wn/' + element.weather[0].icon + '@2x.png');
			daily_icon_des.push(element.weather[0].main);

			temp_array_celcius.push(temp_celcius.toFixed(0));
			temp_array_fare.push(temp_fa.toFixed(0));
			date_array.push(weekday.substring(0, 3));
			hourly_array.push(dateObject.toLocaleString('en-ZA', { hour: 'numeric' }) + ':' + ('0' + dateObject.toLocaleString('en-ZA', { minute: 'numeric' })).slice(-2));
			k = k + 1;
		});
	}

	useEffect(() => {
		const interval = setInterval(() => { // the app will be updated periodically for every 20 minutes
			main_backoff();
			console.log('This will run every 20minues!');
		}, 1200000);//1200000
		return () => clearInterval(interval);
	}, [])

	if (getWeather.status && !error) {
		return (
			<ul className="list-group">
				{date_array.map((value, index) => {
					return (<div key={index} className="list-group-item week-item">
						<div className="left-side">
							<div className="left-img"><img alt="icon" className="snow" src={daily_icon_array[index]} /></div>
							<div className="left-des"><span className="season">{daily_icon_des[index]}</span></div>
						</div>
						<div className="right-side">
							<div>
								<span className="days">{value}</span>
								<span className="small-temperature">{celcius ? temp_array_celcius[index] : temp_array_fare[index]}°</span>
							</div>
						</div>
					</div>)
				})}
			</ul>
		)
	} else {
		return (
			<div className="sniper_bt">
				<button className="btn btn-primary " type="button" onClick={() => { dispatch({ type: 'INC_ATTEMPT', payload: 1 }); main_backoff() }}>
					<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
					&nbsp; &nbsp; Retry Now  &nbsp;&nbsp; {backoffsecond}{backoffsecond !== 0 ? 's' : ''}
				</button>
			</div>
		)
	}
}

export default Weather
