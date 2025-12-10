import { Component, createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './plugins/vue-router';
import store from './plugins/vuex';
import plugins from './plugins';
import forEach from 'lodash/forEach';
import { getGlobalComponents } from './common/loadGlobalComponents';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/global.scss';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import VueVideoPlayer from '@videojs-player/vue';
import 'video.js/dist/video-js.css';

const app = createApp(App)
    .use(store)
    .use(router)
    .use(plugins.i18n)
    .use(VueVideoPlayer)
    .use(plugins.ElementUI, {
        i18n: (key: string) => {
            return plugins.i18n.global.t(key);
        },
    });
// load all components under the folder @/components as glolal components
forEach(getGlobalComponents(), (component, name) => {
    app.component(name, component as Component);
});

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

router.isReady().then(() => {
    app.mount('#app');
});
