import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/globalStyles';
import { lightTheme, darkTheme } from './components/Themes'
import { useDarkMode } from './components/customHooks'
import Toggle from './components/Toggle'
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { backOff } from 'exponential-backoff';
import Temperatures from './components/Temperatures/Temperatures';
import City from './components/CIty/City';
import Switch from './components/Switch';
import Header from './components/Header';


const API_ID = '5d2a8fa8f4d1086adc783976721c0423';
const LON = '18.4232';
const LAT = '-33.9258'

const App = () => {
	const getWeather = useSelector(state => state.getWeather);
	const celcius = useSelector(state => state.getWeather.celci_flag)
	const inc_attemp = useSelector(state => state.getWeather);
	const [backoffsecond, setBackoffsecond] = useState(0);
	const [dayTheme, setDayTheme] = useState(false)
	const dispatch = useDispatch()
	const [error, setError] = useState();
	const [conditionDegrees, setConditionDegree] = useState(false)
	const [theme, themeToggler, mountedComponent] = useDarkMode();
	const themeMode = dayTheme ? lightTheme : darkTheme;

	async function fetchApi() {
		setBackoffsecond(new Date().getSeconds());
		return fetch(`https://api.openweathermap.org/data/2.5/onecall?&lat=-33.9258&lon=18.4232&include=hourly,daily&appid=${API_ID}`)
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

	let dateArray = [];
	let hourlyArray = [];
	let temp_array_celcius = [];
	let temp_array_fare = [];
	let daily_icon_array = [];
	let daily_icon_des = [];
	let current_temp_celci;
	let current_temp_fa;
	let current_date = '';
	let current_weather_icon = 'http://openweathermap.org/img/wn/01d@2x.png';
	let currentWeaterDescription = '';

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
		currentWeaterDescription = getWeather.weatherData.current.weather[0].main;

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
			dateArray.push(weekday.substring(0, 3));
			hourlyArray.push(dateObject.toLocaleString('en-ZA', { hour: 'numeric' }) + ':' + ('0' + dateObject.toLocaleString('en-ZA', { minute: 'numeric' })).slice(-2));
			k = k + 1;
		});
	}
	useEffect(() => {
		main_backoff();
		const hours = new Date().getHours()
		const isDayTime = hours > 6 && hours < 20
		setDayTheme(isDayTime)
		const interval = setInterval(() => { // the app will be updated periodically for every 20 minutes
			main_backoff();
			console.log('This will run every 20 mintues!');
		}, 1200000); //1200000
		return () => clearInterval(interval);
	}, [dayTheme])
	if (!mountedComponent) return <div/>

	const retry = () => {
		dispatch({ type: 'INC_ATTEMPT', payload: 1 });
		main_backoff()
	}
	return (
		<ThemeProvider theme={themeMode}>
			<div className="grid-wrapper">
				<GlobalStyles/>
				<Switch id="id" checked={conditionDegrees} handleToggle={() => setConditionDegree(!conditionDegrees)}/>
				<div className="grid-container">
					{(getWeather.status && !error) ?
						(
							<>
								<div className="grid-row">
									<Header currentTemp={current_temp_celci} />
								</div>
								<div className='grid-row type3'>
									<div className='col'>
										<Temperatures
											tempData={dateArray}
											dailyIcon={daily_icon_array}
											dailyIconDesc={daily_icon_des}
											celcius={conditionDegrees}
											hourly={hourlyArray}
											tempCel={temp_array_celcius}
											tempFar={temp_array_fare}
										/>
									</div>
									<div className='col'>
										<City
											currentWeatherIcon={current_weather_icon}
											currentWeaterDescription={currentWeaterDescription}
											currentTempCelci={current_temp_celci}
											currentTempFa={current_temp_fa}
											currentDate={current_date}
											celcius={conditionDegrees}
											timeZone={getWeather.weatherData.timezone}
										/>
									</div>
								</div>
							</>
						) :

						(
							<div className='grid-row'>
								<div className="sniper_bt">
									<button className="btn btn-primary " type="button" onClick={retry}>
										<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
									Retry Now {backoffsecond}{backoffsecond !== 0 ? 's' : ''}
									</button>
								</div>
							</div>

						)}
				</div>
			</div>
		</ThemeProvider>
	);
}


export default App;
