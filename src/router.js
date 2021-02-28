import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        name: 'index',
        component: () => import('./components/index/index'),
        meta: {
            title: '首页'
        }
    },
    {
        name: 'examlist',
        component: () => import('./components/exams/index'),
        meta: {
            title: '考试列表'
        }
    },
    {
        name: 'examing',
        component: () => import('./components/exams/examing'),
        meta: {
            title: '正式考试'
        }
    },
    {
        name: 'evaluation',
        component: () => import('./components/evaluation/index'),
        meta: {
            title: '语音评测'
        }
    },
    {
        name: 'phoneticsymbol',
        component: () => import('./components/evaluation/phonetic-symbol'),
        meta: {
            title: '英文音标'
        }
    },
    {
        name: 'en-sentence',
        component: () => import('./components/evaluation/en-sentence'),
        meta: {
            title: '英文句子'
        }
    },
];

// add route path
routes.forEach(route => {
    route.path = route.path || '/' + (route.name || '');
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});

export {
    router
};
