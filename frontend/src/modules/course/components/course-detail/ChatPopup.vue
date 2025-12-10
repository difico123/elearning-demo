<template>
    <div
        class="chat-window-wrapper flex-column"
        :style="[
            { display: isShowChatPopup ? 'flex' : 'none !important' },
            { width: isShowChatPopup ? '425px' : '0' },
        ]"
    >
        <div class="top d-flex flex-row justify-content-between align-items-center">
            <el-select
                filterable
                v-model="topicId"
                :placeholder="$t('course.topicSidebar.title')"
                size="large"
            >
                <el-option
                    v-for="topic in topicList"
                    :key="topic.id"
                    :label="topic.name"
                    :value="topic.id"
                    class="text-ellipsis"
                />
            </el-select>
            <img
                @click="closeChatPopup"
                src="@/assets/course/icons/close.svg"
                style="cursor: pointer; margin-right: 8px"
                class="x-button"
                width="12"
                alt=""
            />
        </div>

        <div
            id="chat-box"
            class="middle d-flex flex-column gap-4 align-items-start w-100"
        >
            <div
                class="comment-content-wrapper d-flex gap-3"
                :style="{
                    'flex-direction': isOwnMessage(message) ? 'row-reverse' : 'row',
                }"
                v-for="message in messageList"
                :key="message.id"
            >
                <div style="align-self: end">
                    <img
                        :src="message.avatar"
                        width="35"
                        style="border-radius: 50%"
                        alt=""
                    />
                </div>
                <CommentData :message="message" :isOwnMessage="isOwnMessage" />
            </div>
            <div
                v-if="messageList?.length === 0"
                class="no-chat d-flex align-items-center justify-content-center w-100"
            >
                {{ $t('course.chat.defaultMessage') }}
            </div>
        </div>
        <div
            class="bottom d-flex flex-row align-items-center justify-content-center w-100 comment-blocked"
            v-if="isCommentBlocked"
        >
            {{ $t('course.comment.commentBlocked') }}
        </div>
        <div
            class="bottom d-flex flex-row align-items-center w-100 gap-4 justify-content-between"
            v-else
        >
            <el-input
                class="input send-message-input"
                @keyup.enter="handleSendMessage"
                :placeholder="$t('course.chat.sendMessage')"
                v-model="message"
                autocomplete="off"
                size="large"
            />
            <div @click="handleSendMessage" class="send-message-icon">
                <img src="@/assets/course/icons/send.png" width="25" alt="" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DEFAULT_FIRST_PAGE } from '@/common/constants';
import { showErrorNotificationFunction } from '@/common/helpers';
import { UserCourseStatus } from '@/modules/common/constants/common.interfaces';
import { commonModule } from '@/modules/common/store/common.store';
import { userModule } from '@/modules/user/store/user.store';
import socketInstance from '@/plugins/socket';
import { Options, Vue } from 'vue-class-component';
import { IMessageDetail } from '../../constants/course.interfaces';
import { getMessageList, sendMessage } from '../../services/course';
import { courseModule } from '../../store/course.store';
import { userCourseModule } from '../../store/user-course.store';
import CommentData from './CommentData.vue';

@Options({
    components: { CommentData },
})
export default class ChatPopup extends Vue {
    message = '';

    get isCommentBlocked() {
        return userCourseModule.userCourseData.status === 'comment_blocking';
    }

    get topicId() {
        return courseModule.currentChatTopicId;
    }

    set topicId(value) {
        courseModule.setCurrentChatTopicId(value);
    }

    get userId() {
        return userModule.userData.id;
    }

    get isShowChatPopup() {
        return commonModule.isShowChatPopup;
    }

    get topicList() {
        return courseModule.topicList;
    }

    get messageList() {
        this.setScroll();
        return courseModule.messageList;
    }

    isOwnMessage(message: IMessageDetail) {
        return message.userId === this.userId;
    }

    closeChatPopup() {
        commonModule.toggleChatPopup(false);
    }

    async getMessageList() {
        commonModule.setLoadingIndicator(true);
        const courseId = +this.$route.params.courseId;
        const params = {
            topicId: this.topicId,
            page: DEFAULT_FIRST_PAGE,
            pageSize: 100,
        };
        const response = await getMessageList(courseId, params);
        if (response.success) {
            courseModule.setMessageList(response.data?.items || []);
            courseModule.setCurrentChatTopicId(this.topicId || -1);
        } else {
            courseModule.setMessageList([]);
            showErrorNotificationFunction('');
        }
        commonModule.setLoadingIndicator(false);
    }

    created() {
        this.setScroll();
        this.$watch('isShowChatPopup', () => {
            this.getMessageList();
            this.$nextTick(() => this.setScroll());
            courseModule.resetUnreadMessageCount();
        });
        this.$watch('topicId', () => {
            this.getMessageList();
            this.$nextTick(() => this.setScroll());
        });
        this.$watch('messageList', () => {
            this.$nextTick(() => this.setScroll());
        });
        courseModule.setCurrentChatTopicId(courseModule.selectedTopic.id || -1);
    }

    setScroll() {
        const container = document.querySelector('.middle');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    async handleSendMessage() {
        const courseId = +this.$route.params.courseId;
        const message = this.message;
        this.message = '';
        if (message !== '') {
            socketInstance.chatRealtime(courseId, this.topicId || -1, message);
            const response = await sendMessage(courseId, this.topicId || -1, message);

            this.setScroll();

            if (!response.success) {
                showErrorNotificationFunction('course.errors.commentError');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.option-button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 12px;
    white-space: nowrap;
    padding: 8px 20px;
    transition: all 0.44s ease 0s;
    background-color: $color-white;
    color: #000;
    cursor: pointer;
    &-active {
        color: $color-white;
        background-color: $color-violet-new-opacity-50;
    }
}

.chat-window-wrapper {
    position: fixed;
    bottom: 0;
    right: 3vw;
    height: 60vh;
    border-radius: 6px;
    background: #f3f3f3;
}

.top {
    background: $color-violet-new-1;
    padding: 10px 15px;
}

.bottom {
    border-top: 1px solid #f0f0f0;
    border-radius: 7px;
    padding: 10px;
    flex: 0 0 auto;
}

.middle {
    background-color: $color-violet-new-1-opacity-30;
    padding: 15px;
    flex: 1;
    overflow: auto;
}

.no-chat {
    font-size: 13px !important;
    font-weight: 300 !important;
    line-height: 24px !important;
    font-style: italic;
    text-align: center;
    flex: 1;
    overflow: auto;
}

.send-message-input {
    flex: 1 1 0;
}

.comment-content-wrapper {
    width: 100%;
}

.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.comment-blocked {
    font-size: 13px;
    font-style: italic;
    color: #0f0f0f;
    font-weight: 400;
    padding: 10px 0;
}

.send-message-icon {
    cursor: pointer;
}

.x-button {
    filter: invert(100%) sepia(7%) saturate(0%) hue-rotate(274deg) brightness(102%)
        contrast(103%);
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: xl)) {
    .chat-window-wrapper {
        width: 50% !important;
    }
}
</style>
