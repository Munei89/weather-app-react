import request from './../configs/request'

const getUser = user => request('https://api.openweathermap.org/data/2.5/onecall?lat=-33.924900&lon=18.424100&%20exclude=hourly,daily&appid=316faad353a5748209171f27b4a6ab8b')

export { getUser }
