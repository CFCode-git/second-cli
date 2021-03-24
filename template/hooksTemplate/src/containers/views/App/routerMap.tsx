import { lazy } from 'react'

const PageA = lazy(() => import(/* webpackChunkName:"page-a" */ '@views/PageA'))

const PageB = lazy(() => import(/* webpackChunkName:"page-b" */ '@views/PageB'))

const routerMap = [
    {
        path: '/',
        component: PageA,
    },
    {
        path: '/page-b',
        component: PageB,
    },
]

export default routerMap
