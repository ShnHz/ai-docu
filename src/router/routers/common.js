export default [{
        name: '404',
        path: '/404',
        component: resolve => require(['@/views/404'], resolve),
    },
    {
        path: '*',
        redirect: '/404'
    },
    {
        path: '/index',
        name: 'index',
        component: resolve => require(['@/views/index'], resolve),
        meta: {
            title: ''
        }
    }
]