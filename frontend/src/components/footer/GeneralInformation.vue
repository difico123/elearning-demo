<template>
    <div class="wrapper">
        <router-link
            class="general-information"
            :to="{ name: PageName.GUEST_LANDING_PAGE }"
            ><div class="title d-flex align-items-center">
                <img :src="require('@/assets/common/images/logo2.svg')" class="me-2" />
                {{ $t('common.footer.appName') }}
            </div></router-link
        >
        <div>
            <ul class="p-0 mt-4 mb-2">
                <li class="item">
                    <a class="d-flex" target="_blank" :href="UETAddress">
                        <div>
                            <img
                                class="px-2"
                                :src="require('@/assets/common/icons/footer/map.svg')"
                            />
                        </div>
                        <span>{{ $t('common.footer.address') }}</span>
                    </a>
                </li>
                <li class="item">
                    <a class="d-flex" href="mailto:syntaxerror@vnu.edu.vn">
                        <img
                            class="px-2"
                            :src="require('@/assets/common/icons/footer/mail.svg')"
                        />
                        <span>{{ $t('common.footer.email') }}</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { PageName } from '@/common/constants';

@Options({
    components: {},
})
export default class GeneralInformation extends Vue {
    PageName = PageName;

    get UETAddress() {
        return 'https://www.google.com/maps/place/Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87,+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+Qu%E1%BB%91c+gia+H%C3%A0+N%E1%BB%99i/@21.0382444,105.7804899,17z/data=!3m1!4b1!4m5!3m4!1s0x3135ab354920c233:0x5d0313a3bfdc4f37!8m2!3d21.0382394!4d105.7826786?hl=vi';
    }
}
</script>
<style lang="scss" scoped>
.general-information {
    text-decoration: none;
    color: $color-white;
}

.title {
    height: 44px;
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
}

.item {
    max-width: 280px;
    margin-top: 9px;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    list-style: none;

    cursor: pointer;
    a {
        text-decoration: none;
        color: $color-gray-04;
    }
}
</style>
