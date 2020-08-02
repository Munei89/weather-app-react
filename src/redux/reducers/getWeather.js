const getWeather = (state = {}, action, incval = 1) => {
	switch (action.type) {
	case 'GET_WEATHER':
		return {
			...state,
			weatherData: action.payload,
			status: true
		}
	case 'SET_CELCI':
		return {
			...state,
			celci_flag: action.payload
		}
	case 'INC_ATTEMPT':
		return incval + 1

	default:
		return incval
	}
}

export default getWeather;
