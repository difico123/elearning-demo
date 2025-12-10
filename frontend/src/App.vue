<template>
    <ElConfigProvider :locale="locale">
        <LoadingIndicator />
        <router-view />
    </ElConfigProvider>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { ElConfigProvider } from 'element-plus';
import LoadingIndicator from '@/components/common/LoadingIndicator.vue';
import './plugins/socket';

import en from './plugins/element-ui/locale/en';

import { SupportLanguage } from './common/constants';
import tokenService from './common/tokenService';
@Options({
    components: {
        ElConfigProvider,
        LoadingIndicator,
    },
})
export default class App extends Vue {
    get locale(): Record<string, unknown> {
        const i18nLocale = tokenService.getLanguage() || SupportLanguage.VI;
        return en;
    }
}
</script>
<style lang="scss">
* {
    /* width */
    ::-webkit-scrollbar {
        width: 4px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        background: #888;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: $color-violet-new-1;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    ::v-deep .tox-dialog-wrap__backdrop--opaque {
        display: none !important;
    }

    ::v-deep .tox-dialog-wrap__backdrop {
        display: none !important;
    }
}
</style>
