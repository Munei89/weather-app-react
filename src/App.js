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

const LON = '18.4232';
const LAT = '-33.9258';
const twentyMins = 1200000;
const over15 = 15;
const over25 = 25;
const zero = 0;
const oneThousand = 1000;

const APP_API_URL = 'https://api.openweathermap.org/data/2.5'
const APP_API_KEY = '5d2a8fa8f4d1086adc783976721c0423'
const APP_ICON_URL = 'https://openweathermap.org/img/wn'

const App = () => {
	const getWeather = useSelector(state => state.getWeather);
	const incAttemp = useSelector(state => state.getWeather);
	const errWeather = useSelector(state => state.getWeather)
	const [backoffsecond, setBackoffsecond] = useState(zero);
	const [dayTheme, setDayTheme] = useState(false)
	const dispatch = useDispatch()
	const [conditionDegrees, setConditionDegree] = useState(false)
	const [refresWeather, setRefreshWeather] = useState(1)
	const [mountedComponent] = useDarkMode();
	const themeMode = dayTheme ? lightTheme : darkTheme;
	const hours = new Date().getHours()
	const isDayTime = hours > 6 && hours < 20
	const bgStyle = {
		backgroundImage: `url(${dayTheme ? DayImg : NightImg})`,
		backgroundSize: 'cover',
		height: '100vh',
		backgroundPosition: 'center',
	};
	function handleResponse(response) {
		if (response.ok) {
			return response.json();
		} else {
			dispatch({ type: 'LOAD_ERROR', payload: true });
			throw new Error('Error: Location ' + (response.statusText).toLowerCase());
		}
	}
	function fetchApi() {
		setBackoffsecond(new Date().getSeconds());
		return fetch(
			`${APP_API_URL}
				/onecall?&lat=${LAT}
				&lon=${LON}&include=hourly,daily&appid
				=${APP_API_KEY}`
		).then(res => handleResponse(res))
			.then((response) => {
				return response
			})
			.catch((e) => {
				dispatch({ type: 'LOAD_ERROR', payload: true });
				console.log(e)
			})
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

	if (!errWeather.load_error && getWeather.status) {
		let currentDt = getWeather.weatherData.current.dt;
		const currentMilliseconds = currentDt * oneThousand // 1575909015000
		const currentDateObject = new Date(currentMilliseconds)
		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		currentDate = currentDateObject.toLocaleString('en-ZA', options);
		currentTempCelci = getWeather.weatherData.current.temp - 273.15;
		currentTempFa = currentTempCelci * (9 / 5) + 32;
		currentTempCelci = currentTempCelci.toFixed(zero);
		currentTempFa = currentTempFa.toFixed(zero);
		currentWeatherIcon = `${APP_ICON_URL}/
								${getWeather.weatherData.current.weather[zero].icon}
								@2x.png`;
		currentWeatherDescription = getWeather.weatherData.current.weather[zero].main;
		let dailyTemp = getWeather.weatherData.daily;
		let k = 0;
		dailyTemp.forEach(element => {
			if (k === zero) {
				k = k + 1;
				return;
			}
			const milliseconds = element.dt * oneThousand
			const dateObject = new Date(milliseconds)
			let weekday = dateObject.toLocaleString('en-ZA', { weekday: 'long' }) // Monday
			dateObject.toLocaleString('en-ZA', { hour: 'numeric' }) // 10 AM
			dateObject.toLocaleString('en-ZA', { minute: 'numeric' }) // 30

			let tempKelvin = element.temp.day;
			let tempCelcius = tempKelvin - 273.15;
			let tempFa = tempCelcius * (9 / 5) + 32;

			dailyIconArray.push(`${APP_ICON_URL}/${element.weather[zero].icon}@2x.png`);
			dailyIconDes.push(element.weather[zero].main);

			tempArrayCelcius.push(tempCelcius.toFixed(zero));
			tempArrayFare.push(tempFa.toFixed(zero));
			dateArray.push(weekday.substring(0, 3));
			hourlyArray.push(dateObject.toLocaleString('en-ZA', { hour: 'numeric' }) +
				':'				+
				('0' + dateObject.toLocaleString('en-ZA', { minute: 'numeric' }))
					.slice(-2));
			k = k + 1;
		});
	}
	useEffect(() => {
		async function mainBackoff() {
			try {
				const response = await backOff(() => fetchApi(),
					{ delayFirstAttempt: true, numOfAttempts: 11 - incAttemp, timeMultiple: 3
					});
				dispatch({ type: 'GET_WEATHER', payload: response });
			} catch (e) {
				await mainBackoff();
				console.log('api connection error');
			}
		}
		mainBackoff()
		// eslint-disable-next-line
	}, [refresWeather]);
	useEffect(() => {
		setDayTheme(isDayTime)
		const interval = setInterval(() => {
			setRefreshWeather(refresWeather + 1)
		}, twentyMins); //1200000
		return () => clearInterval(interval);
	}, [isDayTime, refresWeather])

	if (!mountedComponent) return <div/>
	const retry = () => {
		dispatch({ type: 'INC_ATTEMPT', payload: 1 });
	}
	return (
		<ThemeProvider
			theme={themeMode}>
			<div className="grid-wrapper" style={bgStyle}>
				<GlobalStyles/>
				<div className="grid-container">
					{!errWeather.load_error && getWeather.status ?
						(
							<>
								<div className="grid-row">
									<div>
										<Switch
											id='switcher'
											checked={conditionDegrees}
											handleToggle={() => setConditionDegree(!conditionDegrees)}
										/>
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
											celsius={conditionDegrees}
											hourly={hourlyArray}
											tempCel={tempArrayCelcius}
											tempFar={tempArrayFare}
											size={'md'}
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
											celsius={conditionDegrees}
											isDay={dayTheme}
										/>
									</div>
								</div>
								{currentTempCelci < over15 && (
									<Alert
										message="Its below 15"
										type="warning"
									/>
								)
								}
								{currentTempCelci > over25 && (
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
											<span
												className="spinner-border spinner-border-sm"
												role="status"
												aria-hidden="true"
											/>
											Retry Now {backoffsecond}{backoffsecond !== zero ? 's' : ''}
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
