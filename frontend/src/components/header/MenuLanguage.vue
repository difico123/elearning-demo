<template>
    <div class="select-language d-flex">
        <el-dropdown>
            <div class="d-flex align-items-center" style="cursor: pointer">
                <span
                    class="dropdown-selected d-flex justify-content-end"
                    style="gap: 10px"
                >
                    <img
                        :src="
                            require(`@/assets/common/icons/header/language-${selectedLanguage}.svg`)
                        "
                        alt=""
                    />
                    <span class="dropdown-text">{{
                        $t(`common.header.languages.${selectedLanguage}`)
                    }}</span>
                </span>
                <img src="@/assets/common/icons/header/header-select-arrow.svg" alt="" />
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                        v-for="language in languages"
                        :key="language"
                        @click="changeLanguage(language)"
                    >
                        <div class="dropdown-item d-flex align-items-center">
                            <img
                                :src="
                                    require(`@/assets/common/icons/header/language-${language}.svg`)
                                "
                                alt=""
                            />
                            <span class="dropdown-item-text">
                                {{ $t(`common.header.languages.${language}`) }}
                            </span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { SupportLanguage, DEFAULT_LANGUAGE } from '@/common/constants';
import { appModule } from '@/plugins/vuex/appModule';
import localStorageTokenService from '@/common/tokenService';
import i18n from '@/plugins/vue-i18n';

@Options({})
export default class MenuLanguage extends Vue {
    languages = Object.values(SupportLanguage);
    selectedLanguage = DEFAULT_LANGUAGE;
    changeLanguage = (selectedLanguage: SupportLanguage) => {
        this.selectedLanguage = selectedLanguage;
        localStorageTokenService.setLanguage(selectedLanguage);
        i18n.global.locale.value = selectedLanguage;
        appModule.setCurrentLanguage(selectedLanguage);
    };
}
</script>

<style lang="scss" scoped>
.select-language {
    padding: 10px 20px;
    border-radius: 10px;
    background: #e9e9e9;
}
.dropdown-selected,
.dropdown-item-text {
    min-width: 85px;
    font-size: 17px;
    font-weight: 400;
    line-height: 25.5px;
    color: $color-blue-extra;
}
.dropdown-selected {
    margin-right: 7.5px;
    white-space: nowrap;
    align-self: flex-end;
}
.dropdown-item {
    height: 40px;
    padding: 0 20px 0 10px;
}
.dropdown-item:hover {
    background-color: $color-violet-03;
    .dropdown-item-text {
        color: $color-violet-new-1;
        left: 0;
    }
}
.el-dropdown-menu {
    &,
    :deep(.el-dropdown-menu__item) {
        padding: 0;
    }
    &,
    :deep(.el-dropdown-menu__item:first-of-type),
    .dropdown-item:first-of-type {
        border-top-left-radius: 12px;
    }
    &,
    :deep(.el-dropdown-menu__item:last-of-type),
    .dropdown-item:last-of-type {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xl)) {
    .dropdown-text,
    .dropdown-item-text {
        display: none;
    }

    .dropdown-selected {
        min-width: 0 !important;
    }
}
</style>
