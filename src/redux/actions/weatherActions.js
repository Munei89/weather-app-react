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

export default {
	getWeather,
	setCelci,
	incAttempt
}
