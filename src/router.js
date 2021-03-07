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
        name: 'en-word',
        component: () => import('./components/evaluation/en-word'),
        meta: {
            title: '英文单词'
        }
    },
    {
        name: 'en-sentence',
        component: () => import('./components/evaluation/en-sentence'),
        meta: {
            title: '英文句子'
        }
    },
    {
        name: 'mocklist',
        component: () => import('./components/mocks/index'),
        meta: {
            title: '套题模拟'
        }
    },
    {
        name: 'mockdetail',
        component: () => import('./components/mocks/mocks'),
        meta: {
            title: '模拟考试'
        }
    },
    {
        name: 'questions',
        component: () => import('./components/questions/index'),
        meta: {
            title: '题库列表'
        }
    },
    {
        name: 'questiondetail',
        component: () => import('./components/questions/questions'),
        meta: {
            title: '模拟考试'
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
