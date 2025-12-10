<template>
    <div class="course-detail-page">
        <CourseDetail />
        <div v-if="chatTopicId != -1" @click="toggleChatPopup" class="chat-wrapper">
            <img src="@/assets/course/images/chat.png" width="40" alt="" />
            <div class="unread-counter">{{ unreadMessageCount }}</div>
        </div>
        <ChatPopup v-if="chatTopicId != -1" />
    </div>
</template>

<script lang="ts">
import { commonModule } from '@/modules/common/store/common.store';
import { Options, Vue } from 'vue-class-component';
import CourseDetail from '../components/course-detail/CourseDetail.vue';
import { CourseArea, SidebarMode } from '../constants/course.constants';
import { courseModule } from '../store/course.store';
import ChatPopup from '../components/course-detail/ChatPopup.vue';
import socketInstance from '@/plugins/socket';
import { cloneDeep } from 'lodash';
import { userCourseModule } from '../store/user-course.store';
import { getUserCourseData } from '../services/user-course';
import { showErrorNotificationFunction } from '@/common/helpers';

@Options({
    components: { CourseDetail, ChatPopup },
})
export default class CourseListPage extends Vue {
    get unreadMessageCount() {
        return courseModule.unreadMessageCount;
    }

    get isShowChatPopup() {
        return commonModule.isShowChatPopup;
    }

    get chatTopicId() {
        return courseModule.currentChatTopicId;
    }

    async getUserCourseData() {
        commonModule.setLoadingIndicator(true);
        const id: number = +this.$route.params.courseId;
        const response = await getUserCourseData(id);
        if (response.success) {
            userCourseModule.setUserCourseData(response?.data || {});
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.userCourseDataError') },
            ];
            userCourseModule.setUserCourseData({});
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    toggleChatPopup() {
        commonModule.toggleChatPopup(true);
    }

    async mounted() {
        courseModule.setTopicSidebarMode(SidebarMode.COLLAPSED);
        courseModule.setQuizSidebarMode(SidebarMode.COLLAPSED);
        courseModule.setCourseArea(CourseArea.COURSE);
        courseModule.resetUnreadMessageCount();
        commonModule.toggleChatPopup(false);
        await this.getUserCourseData();
        socketInstance.joinRoom(+this.$route.params.courseId);
        socketInstance.listenChat((data) => {
            if (courseModule.currentChatTopicId === data.sourceId) {
                let newChat = cloneDeep(courseModule.messageList);
                let chatList = newChat.concat(data);
                courseModule.setMessageList(chatList);
                courseModule.incrementUnreadMessageCount();
            }
        });
    }
}
</script>
<style lang="scss" scoped>
.chat-wrapper {
    position: fixed;
    bottom: 12vh;
    right: 3vw;
    padding: 12px;
    border-radius: 50%;
    background: $color-violet-new-1;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        background: $color-violet-new-2;
    }
}

.unread-counter {
    padding: 1px 4px;
    background: red;
    border-radius: 50%;
    color: $color-white;
    position: absolute;
    top: 0%;
    right: 0%;
}
</style>
