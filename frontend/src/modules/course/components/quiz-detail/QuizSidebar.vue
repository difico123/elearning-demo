<template>
    <div class="quiz-sidebar-wrapper d-flex flex-column">
        <div
            @click.self="handleToggleSidebar"
            class="button topic-title d-flex justify-content-between"
            :class="{ collapsed: isCollapsed }"
            style="cursor: pointer"
        >
            <span v-if="!isCollapsed" class="text-ellipsis">{{
                $t('course.topicSidebar.title')
            }}</span>
        </div>
        <div
            v-for="(topic, index) in topicList"
            :key="topic.id"
            @click="handleClickTopic(topic)"
            class="button sidebar d-flex"
            :class="{ collapsed: isCollapsed }"
        >
            <div>{{ index + 1 }}</div>
            <div v-if="!isCollapsed" class="text-ellipsis">
                {{ '.\xa0' }}
                {{ topic?.name }}
            </div>
        </div>
        <div
            class="button d-flex no-topic"
            :class="{ collapsed: isCollapsed }"
            v-if="topicList?.length === 0 && !isCollapsed"
        >
            {{ $t('course.errors.getTopicListError') }}
        </div>
    </div>
</template>

<script lang="ts">
import { SystemRole } from '@/common/constants';
import { showErrorNotificationFunction } from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { userModule } from '@/modules/user/store/user.store';
import { Options, Vue } from 'vue-class-component';
import { SidebarMode } from '../../constants/course.constants';
import { ITopicData } from '../../constants/course.interfaces';

import { getQuizList } from '../../services/course';
import { courseModule } from '../../store/course.store';

@Options({
    components: {},
})
export default class CourseSidebar extends Vue {
    QuizSidebarMode = SidebarMode;
    SystemRole = SystemRole;

    get userRole() {
        return userModule.userData.role;
    }
    get topicList() {
        return courseModule.topicList;
    }

    get selectedTopic() {
        return courseModule.selectedTopic;
    }

    get quizSidebarMode() {
        return courseModule.quizSidebarMode;
    }

    get isCollapsed() {
        return this.quizSidebarMode === SidebarMode.COLLAPSED;
    }

    get topicId() {
        return courseModule.topicId;
    }

    handleToggleSidebar() {
        if (this.quizSidebarMode === SidebarMode.EXPANDED) {
            courseModule.setQuizSidebarMode(SidebarMode.COLLAPSED);
        } else {
            courseModule.setQuizSidebarMode(SidebarMode.EXPANDED);
        }
    }

    async handleClickTopic(topic: ITopicData) {
        courseModule.setTopicId(topic.id as number);
        await this.refreshInstructorQuizDetail();
        courseModule.toggleShowTopicVideo(true);
    }

    async refreshInstructorQuizDetail() {
        const courseId = +this.$route.params.courseId;
        commonModule.setLoadingIndicator(true);
        const response = await getQuizList(courseId, this.topicId as number);
        if (response?.success) {
            courseModule.setQuizList(response?.data?.items || []);
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getQuizListError') },
            ];
            courseModule.setQuizList([]);
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }

    async created() {
        commonModule.setLoadingIndicator(true);
        window.addEventListener('resize', this.showFullScreenOnMobile);
        this.showFullScreenOnMobile();
        courseModule.setTopicId(courseModule.topicList[0]?.id || 1);
        await this.refreshInstructorQuizDetail();
        courseModule.setAddingQuiz(false);
        commonModule.setLoadingIndicator(false);
    }

    showFullScreenOnMobile() {
        if (document.documentElement.clientWidth <= 1200) {
            courseModule.setQuizSidebarMode(SidebarMode.COLLAPSED);
        }
    }
}
</script>
<style lang="scss" scoped>
.quiz-sidebar-wrapper {
    min-height: 169px;
    height: 100%;
    cursor: pointer;
    background-color: #f9f9f9;
}

.button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    padding: 12px 24px;
    transition: all 0.44s ease 0s;
    cursor: pointer;
    color: $color-white;
    width: 16vw;
}

.collapsed {
    width: 60px;
    padding: 12px 0;
    justify-content: center !important;
}
.sidebar {
    background-color: $color-violet-new-1;
    &:hover {
        background-color: $color-violet-new;
    }
}

.no-topic {
    background-color: #f9f9f9;
    color: #000;
    padding: 48px 0;
    justify-content: center;
    font-weight: 300 !important;
    font-size: 14px;
    cursor: initial;
}

.topic-title {
    background-color: #e6e6f0;
    color: #000;
    height: 48px;
}

.j-center {
    justify-content: center !important;
}

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
</style>
