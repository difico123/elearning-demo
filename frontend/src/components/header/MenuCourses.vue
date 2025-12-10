<template>
    <div>
        <router-link
            class="text-decoration-none"
            :to="{ name: PageName.USER_COURSE_LIST_PAGE }"
        >
            <div
                class="courses-button d-flex flex-row align-items-center"
                style="gap: 8px"
            >
                <img
                    src="https://img.icons8.com/external-vitaliy-gorbachev-lineal-color-vitaly-gorbachev/2x/external-book-back-to-school-vitaliy-gorbachev-lineal-color-vitaly-gorbachev.png"
                    alt=""
                    width="20"
                />
                <span>
                    {{ $t('common.header.courses') }}
                </span>
            </div>
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { SupportLanguage, DEFAULT_LANGUAGE } from '@/common/constants';
import { PageName } from '@/common/constants';
import MenuLanguage from './MenuLanguage.vue';

@Options({ components: { MenuLanguage } })
export default class HeaderGuest extends Vue {
    PageName = PageName;
    languages = Object.values(SupportLanguage);
    selectedLanguage = DEFAULT_LANGUAGE;

    changeLanguage = (selectedLanguageCode: SupportLanguage) => {
        this.selectedLanguage = selectedLanguageCode;
    };
}
</script>

<style lang="scss" scoped>
.courses-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 8px;
    white-space: nowrap;
    padding: 12px 24px;
    color: $color-gray-01;
    background-color: $color-white;
    border: 1px solid black;
    transition: all 0.44s ease 0s;
    &:hover {
        color: $color-white;
        background-color: $color-violet-new-1;
        border: 1px solid $color-violet-new-1;
    }
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: lg)) {
    .courses-button {
        display: none !important;
    }
}
</style>
