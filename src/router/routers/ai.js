import Layout from '@/components/layout/frame/Layout.vue'

export default [
  {
    path: '/ai',
    component: Layout,
    redirect: '/ai/docu',
    meta: {
      title: 'AI',
      hasTabs: true,
    },
    children: [
      {
        path: '/ai/docu',
        name: 'AiDocu',
        component: () => import('@/views/ai/docu.vue'),
        meta: {
          title: 'Docu',
        },
      },
    ],
  },
]
