import axios from 'axios'
const request = axios.create({
    baseURL: 'https://speech.okstack.com:36080/Portal',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

request.interceptors.request.use(config => {
    // const token = localStorage.getItem('token')
    // if (!token) {
    //     config.headers['token'] = token
    // }
    return config
}, error => {
    const data = error.response.data
    console.log(data)
})

request.interceptors.response.use((response) => {
    if (response.status == 200) {
        return response.data
    } else {
        return Promise.reject(response)
    }
}, error => {
    return {
        respCode: 5,
        respMessage: error.msessage || '请求失败，请重试！'
    }
})

export default request