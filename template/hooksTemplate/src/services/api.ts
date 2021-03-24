import http from './http'

export const getArticleList = (data = {}) => {
    return http.get('article/list', data)
}
