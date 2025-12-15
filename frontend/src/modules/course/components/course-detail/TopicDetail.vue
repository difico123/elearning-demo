<template>
    <div class="topic-detail-wrapper d-flex bg-white flex-column w-100 gap-3">
        <div
            class="title-wrapper d-flex flex-sm-row flex-column align-items-center justify-content-between"
        >
            <div class="topic-detail-title">{{ selectedTopic?.name }}</div>
            <div
                class="edit-topic-button"
                @click="handleEditTopic"
                v-if="userRole === SystemRole.INSTRUCTOR"
            >
                {{ $t('course.topic.action.edit') }}
            </div>
        </div>
        <div class="topic-detail-description">{{ selectedTopic?.description }}</div>
        <div class="topic-show-video pb-4" v-if="selectedTopic?.video">
            <span
                @click="showTopicVideo"
                v-if="!isShowTopicVideo && !!selectedTopic?.video"
            >
                {{ $t('course.topic.showVideo') }}
            </span>
            <span @click="hideTopicVideo" v-else>{{ $t('course.topic.hideVideo') }}</span>
        </div>
        <div
            v-if="isShowTopicVideo && selectedTopic?.video != ''"
            class="topic-video d-flex justify-content-center mx-auto"
            style="width: 50vw"
        >
            <video-player
                :src="selectedTopic?.video"
                controls
                :loop="true"
                :volume="0.6"
                playsinline
                :height="320"
                :techOrder="['html5', 'flvjs']"
            />
        </div>

        <div class="topic-detail-content" v-html="selectedTopic?.content"></div>
        <BaseNoResult
            v-if="selectedTopic && !selectedTopic.id"
            :message="
                userRole === SystemRole.STUDENT
                    ? $t('course.errors.studentGetTopicError')
                    : $t('course.errors.instructorGetTopicError')
            "
        />
    </div>
</template>

<script lang="ts">
import { SystemRole } from '@/common/constants';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import { courseModule } from '../../store/course.store';

@Options({
    components: {},
})
export default class TopicDetail extends Vue {
    SystemRole = SystemRole;

    get isShowTopicVideo() {
        return courseModule.isShowTopicVideo;
    }

    get userRole() {
        return userModule.userData.role;
    }
    get selectedTopic() {
        return courseModule.selectedTopic;
    }

    showTopicVideo() {
        courseModule.toggleShowTopicVideo(true);
    }
    hideTopicVideo() {
        courseModule.toggleShowTopicVideo(false);
    }

    handleEditTopic() {
        courseModule.toggleShowTopicFormPopup(true);
        courseModule.setTopicFormPopupMode('edit');
    }
}
</script>
<style lang="scss" scoped>
.topic-detail {
    &-wrapper {
        padding: 4vh 3vw;
    }

    &-title {
        font-weight: 600;
        font-size: 36px;
    }

    &-description {
        font-weight: 400;
        font-size: 20px;
    }
}

.topic-show-video {
    cursor: pointer;
    color: $color-violet-new;
    &:hover {
        color: $color-violet-new-1;
    }
}

.edit-topic-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 6px;
    padding: 8px 20px;
    transition: all 0.44s ease 0s;
    background-color: $color-violet-new-1;
    color: $color-white;
    cursor: pointer;
    &:hover {
        background-color: $color-violet-new-opacity-50;
    }
}
</style>
