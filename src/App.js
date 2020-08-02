import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/globalStyles';
import { lightTheme, darkTheme } from './components/Themes'
import { useDarkMode } from './components/customHooks'
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { backOff } from 'exponential-backoff';
import Temperatures from './components/Temperatures/Temperatures';
import City from './components/CIty/City';
import Switch from './components/Switch';
import Header from './components/Header';
import DayImg from '../src/assets/images/day.png'
import NightImg from '../src/assets/images/night.png'
import Alert from './components/Alert';
import styles from './App.module.scss'

const LON = '18.4232';
const LAT = '-33.9258'

const App = () => {
	const getWeather = useSelector(state => state.getWeather);
	const incAttemp = useSelector(state => state.getWeather);
	const [backoffsecond, setBackoffsecond] = useState(0);
	const [dayTheme, setDayTheme] = useState(false)
	const dispatch = useDispatch()
	const [error, setError] = useState();
	const [conditionDegrees, setConditionDegree] = useState(false)
	const [mountedComponent] = useDarkMode();
	const themeMode = dayTheme ? lightTheme : darkTheme;
	const bgStyle = {
		backgroundImage: `url(${dayTheme ? DayImg : NightImg})`,
		backgroundSize: 'cover',
		height: '100vh',
		backgroundPosition: 'center',
	};
	async function fetchApi() {
		setBackoffsecond(new Date().getSeconds());
		return fetch(`${process.env.REACT_APP_API_URL}/onecall?&lat=${LAT}&lon=${LON}&include=hourly,daily&appid=${process.env.REACT_APP_API_KEY}`)
			.then(response => {
				return response.json()
			})
		try {
			const
				response = await backOff(() => fetchApi(),
					{ delayFirstAttempt: true, numOfAttempts: 11 - incAttemp, timeMultiple: 3
					});
			dispatch({ type: 'GET_WEATHER', payload: response });
		} catch (e) {
			mainBackoff();
			setError(true)
		}
	}
	async function mainBackoff() {
		try {
			const response = await backOff(() => fetchApi(),
				{ delayFirstAttempt: true, numOfAttempts: 11 - incAttemp, timeMultiple: 3
				});
			console.log('api connection success===', response);
			dispatch({ type: 'GET_WEATHER', payload: response });
		} catch (e) {
			await mainBackoff();
			console.log('api connection error===');
		}
	}

	let dateArray = [];
	let hourlyArray = [];
	let tempArrayCelcius = [];
	let tempArrayFare = [];
	let dailyIconArray = [];
	let dailyIconDes = [];
	let currentTempCelci;
	let currentTempFa;
	let currentDate = '';
	let currentWeatherIcon = '';
	let currentWeatherDescription = '';

	if (getWeather.status) {
		let currentDt = getWeather.weatherData.current.dt;
		const currentMilliseconds = currentDt * 1000 // 1575909015000
		const currentDateObject = new Date(currentMilliseconds)
		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		currentDate = currentDateObject.toLocaleString('en-ZA', options);
		currentTempCelci = getWeather.weatherData.current.temp - 273.15;
		currentTempFa = currentTempCelci * (9 / 5) + 32;
		currentTempCelci = currentTempCelci.toFixed(0);
		currentTempFa = currentTempFa.toFixed(0);

		currentWeatherIcon = `${process.env.REACT_APP_ICON_URL}/${getWeather.weatherData.current.weather[0].icon}@2x.png`;
		currentWeatherDescription = getWeather.weatherData.current.weather[0].main;

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

			dailyIconArray.push(`${process.env.REACT_APP_ICON_URL}/${element.weather[0].icon}@2x.png`);
			dailyIconDes.push(element.weather[0].main);

			tempArrayCelcius.push(temp_celcius.toFixed(0));
			tempArrayFare.push(temp_fa.toFixed(0));
			dateArray.push(weekday.substring(0, 3));
			hourlyArray.push(dateObject.toLocaleString('en-ZA', { hour: 'numeric' }) +
				':'				+
				('0' + dateObject.toLocaleString('en-ZA', { minute: 'numeric' }))
					.slice(-2));
			k = k + 1;
		});
	}
	useEffect(() => {
		mainBackoff();
		const hours = new Date().getHours()
		const isDayTime = hours > 6 && hours < 20
		setDayTheme(isDayTime)
		console.log(process.env)
		const interval = setInterval(() => { // the app will be updated periodically for every 20 minutes
			mainBackoff();
			console.log('This will run every 20 mintues!');
		}, 1200000); //1200000
		return () => clearInterval(interval);
	}, [dayTheme])
	if (!mountedComponent) return <div/>

	const retry = () => {
		dispatch({ type: 'INC_ATTEMPT', payload: 1 });
		mainBackoff()
	}
	return (
		<ThemeProvider
			theme={themeMode}>
			<div className="grid-wrapper" style={bgStyle}>
				<GlobalStyles/>
				<div className="grid-container">
					{(getWeather.status && !error) ?
						(
							<>
								<div className="grid-row">
									<div>
										<Switch id="id" checked={conditionDegrees} handleToggle={() => setConditionDegree(!conditionDegrees)}/>
										{'  '}
										<span>{!conditionDegrees ? 'Celsius' : 'Fahrenheit'}</span>
									</div>
								</div>
								<div className="grid-row">
									<Header />
								</div>
								<div className='grid-row type3'>
									<div className='col'>
										<Temperatures
											tempData={dateArray}
											dailyIcon={dailyIconArray}
											dailyIconDesc={dailyIconDes}
											celcius={conditionDegrees}
											hourly={hourlyArray}
											tempCel={tempArrayCelcius}
											tempFar={tempArrayFare}
											isDay={dayTheme}
										/>
									</div>
									<div className='col'>
										<City
											currentWeatherIcon={currentWeatherIcon}
											weatherDescription={currentWeatherDescription}
											currentTempCelci={currentTempCelci}
											currentTempFa={currentTempFa}
											currentDate={currentDate}
											celcius={conditionDegrees}
											isDay={dayTheme}
										/>
									</div>
								</div>
								{currentTempCelci < 15 && (
									<Alert
										message="Its below 15"
										type="warning"
									/>
								)
								}
								{currentTempCelci > 25 && (
									<Alert
										message="its over 25 C"
										type="warning"
									/>
								)
								}
							</>
						) :

						(
							<div className='grid-row'>
								<div>
									<div className="sniper_bt">
										<button className="button" type="button" onClick={retry}>
											<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
											Retry Now {backoffsecond}{backoffsecond !== 0 ? 's' : ''}
										</button>
									</div>
								</div>
							</div>

						)}
				</div>
			</div>
		</ThemeProvider>
	);
}


export default App;
