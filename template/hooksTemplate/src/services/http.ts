import { message } from 'antd'
import axios, { AxiosRequestConfig } from 'axios'
import qs from 'qs'

const baseURL = 'http://127.0.0.1:3001/api'

type Request = (url: string, data?: object) => Promise<any>

interface HttpRequest {
    get?: Request
    post?: Request
    delete?: Request
    put?: Request
}

type Method = 'get' | 'post' | 'delete' | 'put'

const methods: Method[] = ['get', 'post', 'delete', 'put']

const http: HttpRequest = {}

methods.forEach((v) => {
    http[v] = (url: string, data: any) => {
        const config: AxiosRequestConfig = {
            url,
            method: v,
            baseURL,
        }
        const instance = axios.create({
            baseURL,
        })
        // 请求拦截
        instance.interceptors.request.use(
            (config) => {
                // 在这里添加头部信息
                return config
            },
            (error) => {
                // 错误抛出
                return Promise.reject(error)
            }
        )
        // 响应拦截
        instance.interceptors.response.use(
            (response) => {
                if (response && response.data) {
                    return response.data
                }
                return response
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        if (v === 'get' || v === 'delete') {
            config.params = data
        } else {
            config.data = qs.stringify(data)
        }

        return instance
            .request(config)
            .then((res) => {
                return res
            })
            .catch((error) => {
                if (!!error.response) {
                    const errorData = error.response.data
                    message.error(errorData.message)
                } else {
                    const msg = error.message === 'Network Error' ? '网络错误' : '未知错误'
                    message.error(msg)
                }
                return Promise.reject(error)
            })
    }
})

export default http
