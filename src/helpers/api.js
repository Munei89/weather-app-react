export async function initFetch() {
	try {
		const weatherData = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=-33.924900&lon=18.424100&%20exclude=hourly,daily&appid=5d2a8fa8f4d1086adc783976721c0423').then(response => {
			return response.json()
		}).then(data => {
			return data
		})
	} catch (e) {
		// handle error
		console.log('api connection error===');
	}
}
