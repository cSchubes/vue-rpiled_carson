import axios from 'axios'
export default() => {
  return axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://4fe20dd2ef64963a61765e319332ab35.balena-devices.com/api' : 'http://localhost:8081/api',
    headers: {'Access-Control-Allow-Origin': '*'}
  })
}
