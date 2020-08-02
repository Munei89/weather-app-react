const getWeather = () => {
	return {
		type: 'GET_WEATHER'
	}
}
const setCelci = (tempObj) => {
	return {
		type: 'SET_CELCI',
		payload: tempObj
	}
}
const incAttempt = (val) => {
	return {
		type: 'INC_ATTEMPT',
		payload: val
	}
}
const errorWeather = (err) => {
	return {
		type: 'LOAD_ERROR',
		payload: err
	}
}

export default {
	getWeather,
	setCelci,
	incAttempt,
	errorWeather
}
