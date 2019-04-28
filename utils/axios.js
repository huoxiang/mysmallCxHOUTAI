import axios from 'axios'
const instance = axios.create({
    timeout:1000,
    headers:{
        'X-Requested-With': 'XMLHttpRequest'
    }
})
export default instance
//创建axios实例