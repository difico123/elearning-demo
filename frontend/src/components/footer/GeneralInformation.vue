<template>
    <div class="wrapper">
        <router-link
            class="general-information"
            :to="{ name: PageName.GUEST_LANDING_PAGE }"
            ><div class="title d-flex align-items-center">
                <img :src="require('@/assets/common/images/logo.png')" class="me-2" />
            </div></router-link
        >
        <div class="info-content">
            <p class="info-text">Số 4 ngõ 22 Trung Kính, Cầu Giấy, Hà Nội</p>
            <p class="info-text">Hotline tư vấn giải pháp : 092.6886.855</p>
            <p class="info-text">Hotline hỗ trợ kỹ thuật : 0966.966.051/052/053</p>
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
.wrapper {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.general-information {
    text-decoration: none;
    color: $color-gray-900;
}

.title {
    height: 44px;
    font-weight: 600;
    font-size: 20px;
    line-height: 32px;
}

.info-content {
    display: flex;
    flex-direction: column;
}

.info-text {
    margin: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: $color-gray-500;
}
</style>
