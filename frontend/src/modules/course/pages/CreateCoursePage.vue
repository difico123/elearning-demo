<template>
    <div>
        <div class="image-wrapper">
            <img :src="require(`@/assets/course/bg.jpg`)" alt="" class="image" />
        </div>
        <div class="container d-flex gap-4">
            <div class="left-form">
                <div class="wrapper">
                    <div class="image-wrap">
                        <div class="profile-image-wrapper">
                            <div class="w-100" v-if="true">
                                <img
                                    class="profile-image w-100"
                                    :src="isChangingAvatar ? previewImagePath(thumbnail!!) :'https://i.pinimg.com/236x/20/90/0d/20900d8b66128671e6822255ceb1151f.jpg'  "
                                    alt=""
                                />
                            </div>
                            <div
                                v-else
                                class="default-avatar profile-image d-flex align-items-center justify-content-center"
                                :style="{ 'background-color': 'red' }"
                            ></div>
                            <label class="upload-button" for="file-input">
                                <div class="camera-wrapper">
                                    <img src="@/assets/user/icons/camera.svg" alt="" />
                                </div>
                            </label>
                            <input
                                type="file"
                                @change="handleChangeProfileImage(($event.target as any)?.files)"
                                class="d-none"
                                id="file-input"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div class="create-course-buttons">
                        <el-button
                            type="primary"
                            class="create-course w-100 buttons"
                            @click="handleCourseSubmit"
                        >
                            {{ $t('course.course.createCourse') }}
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="right-form d-flex flex-column">
                <h1>{{ $t('course.course.createCourse') }}</h1>
                <div class="select-category d-flex flex-row align-items-center mt-3">
                    <p class="mt-0 mb-0 mr-6 text">
                        {{ $t('course.course.selectCategory') }}
                    </p>
                    <CategoryDropDown @select-category="handleSelectCategory" />
                </div>

                <BaseInputText
                    class="input mt-4"
                    :label="$t('course.course.title')"
                    :placeholder="$t('course.course.placeholder')"
                    v-model:value="name"
                    autocomplete="off"
                />

                <BaseInputText
                    class="input"
                    :label="$t('course.course.description')"
                    :placeholder="$t('course.course.description')"
                    v-model:value="description"
                    autocomplete="off"
                />

                <div
                    class="gap-4 align-self-start group-btn-submit justify-content-center"
                >
                    <div class="mt-2">
                        <BaseInputNumber
                            class="input"
                            :label="$t('course.course.coursePrice')"
                            :placeholder="$t('course.course.coursePrice')"
                            v-model:value="price"
                            allowDecimal="true"
                            autocomplete="off"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { getCategoryList } from '@/modules/landing/services/landing';
import { landingModule } from '@/modules/landing/store/landing.store';
import { Options, Vue } from 'vue-class-component';
import CategoryDropDown from '../components/CategoryDropDown.vue';
import { yyyymmddFormat } from '@/common/commonFunctions';
import { IMAGE_EXTENSION_LIST } from '@/common/constants';
import { ICourseCreation } from '../constants/course.interfaces';
import { createCourse } from '../services/course';
@Options({
    components: { CategoryDropDown },
})
export default class CreateCoursePage extends Vue {
    name = '';
    status = false;
    date: Date[] | string[] = ['', ''];
    description = '';
    categoryId = -1;
    price = 0;
    thumbnail: File | null = null;
    isChangingAvatar = false;
    file: string | undefined = '';
    userForm: any;

    checkImageFormat(name: string) {
        const fileParts: Array<string> = name.split(/[.]/);
        if (!IMAGE_EXTENSION_LIST.includes(fileParts[fileParts.length - 1])) {
            return false;
        }
        return true;
    }

    previewImagePath(file: File) {
        if (!this.checkImageFormat(file.name)) {
            showErrorNotificationFunction(this.$t('user.errors.invalidImage') as string);
            this.isChangingAvatar = false;
            return;
        } else {
            return URL.createObjectURL(file);
        }
    }

    handleChangeProfileImage(files: File[]) {
        this.thumbnail = files[0];
        this.file = this.previewImagePath(this.thumbnail);
        this.isChangingAvatar = true;
        if (this.checkImageFormat(files[0].name)) {
            showSuccessNotificationFunction('Success');
        } else return;
    }

    async getCategoryList() {
        commonModule.setLoadingIndicator(true);
        const response = await getCategoryList();
        if (response.success) {
            landingModule.setCategoryList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getCategoryListError') },
            ];
            landingModule.setCategoryList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async created() {
        await this.getCategoryList();
    }

    handleSelectCategory(categoryId: number) {
        this.categoryId = categoryId;
    }

    async handleCourseSubmit() {
        commonModule.setLoadingIndicator(true);

        const courseData: ICourseCreation = {
            isPublished: this.status,
            name: this.name,
            description: this.description,
            price: this.price,
        };
        let formData = new FormData();
        const { name, description, price, isPublished } = courseData;

        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', String(price));
        formData.append('isPublished', isPublished.toString());

        if (this.thumbnail) {
            formData.append('file', this.thumbnail || '');
        }
        const response = await createCourse(formData, this.categoryId);

        if (response.success) {
            showSuccessNotificationFunction(
                this.$t('user.success.updateUserDataSuccess'),
            );
        } else {
            let res = response?.errors || [
                { message: this.$t('user.errors.updateUserDataError') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>
<style lang="scss" scoped>
.image-wrapper {
    height: 80vh;
}
.image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    object-position: 100% 40%;
    border-radius: 12px;
}
:deep(.container) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -40%);
}
.create-course {
    margin-top: 20px;
    min-width: 200px;
    width: 100%;
    align-self: flex-end;
}

.create-course-buttons {
    width: 100%;
    align-self: flex-end;
    justify-self: flex-end;
    position: absolute;
    bottom: 5%;
}
.wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.left-form {
    background-color: $color-white;
    padding: 50px 20px;
    min-width: 300px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    .image-wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-radius: 12px;
        .instructor {
            color: $color-violet-new-1;
        }
    }
}

.profile-image-wrapper {
    padding-top: 50px;
    width: 270px !important;
    position: relative;
    justify-content: center;
    align-self: flex-start;
    .profile-image {
        width: 100% !important;
        border-radius: 20px;
        border: 2px solid #888;
        aspect-ratio: 1 / 1;
    }
    .default-avatar {
        cursor: pointer;
        font-style: normal;
        color: white;
        text-align: center;
        font-weight: 400;
        font-size: 80px;
    }
    .upload-button {
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: absolute;
        top: 80%;
        right: 10%;
        &:hover {
            opacity: 0.88;
        }
    }
    .camera-wrapper {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        padding: 6px;
        background-color: #aaa;
        border: 1px solid #888;
    }
}
.right-form {
    background-color: $color-white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    padding: 50px 20px;
    border-radius: 10px;
    width: 100%;
    justify-content: center;
}
.date-range {
    font-weight: 700;
}
.date {
    width: 200px;
    padding: 0 20px;
}
.text {
    color: $color-black;
    font-weight: 700;
    margin-right: 10px;
}
.active-courses {
    min-width: 200px;
    width: 100%;
    align-self: flex-end;
    margin-top: 100px;
}

.active-color {
    background-color: $color-violet-new-1 !important;
}
.inactive-color {
    background-color: red !important;
}
.group-btn-submit {
    margin-top: 10px;
    margin-bottom: 50px;
}
.buttons {
    margin-top: 20px;
    padding: 20px 0;
}
.start-date-wrapper {
    display: flex;
    cursor: pointer;
    justify-content: center;
    flex-direction: column;
}
.start-date {
    padding: 12px 12px;
    box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

:deep(.el-range-editor.el-input__inner) {
    padding: 10px 21px;
}
:deep(.el-button--primary) {
    border-color: unset;
}
@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
    .title {
        font-size: 32px !important;
        line-height: 48px !important;
        margin: 32px auto 0 !important;
    }
    .container {
        flex-direction: column-reverse;
        position: relative;
        top: unset;
        left: unset;
        transform: translateY(-20%);
    }
    .create-course-buttons {
        position: relative;
    }
    .profile-image-wrapper {
        padding-top: 0px;
    }
    .image-wrapper {
        height: unset;
    }
}
</style>
