import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex/index';
import {
    IInstructorData,
    INotificationData,
    NotificationType,
} from '../constants/common.interfaces';

@Module({ dynamic: true, namespaced: true, store, name: 'common' })
class CommonModule extends VuexModule {
    instructorList: Array<IInstructorData> = [];
    notificationList: Array<INotificationData> = [];
    showLoadingIndicator = false;
    isShowStudentListPopup = false;
    isShowChatPopup = false;

    @Action
    toggleShowStudentListPopup(isShowStudentListPopup: boolean) {
        this.TOGGLE_SHOW_STUDENT_LIST_POPUP(isShowStudentListPopup);
    }

    @Mutation
    TOGGLE_SHOW_STUDENT_LIST_POPUP(isShowStudentListPopup: boolean) {
        this.isShowStudentListPopup = isShowStudentListPopup;
    }

    @Action
    setInstructorList(instructorList: Array<IInstructorData>) {
        this.SET_INSTRUCTOR_LIST(instructorList || []);
    }

    @Mutation
    SET_INSTRUCTOR_LIST(instructorList: Array<IInstructorData>) {
        this.instructorList = instructorList;
    }

    @Action
    setNotificationList(notificationList: Array<INotificationData>) {
        this.SET_NOTIFICATION_LIST(notificationList || []);
    }

    @Action
    setJoinCourseNotification(notificationId: number) {
        const notifications = this.notificationList.map((item) => {
            const { type, id } = item;
            return {
                ...item,
                type: notificationId === id ? NotificationType.studentJoinCourse : type,
            };
        });
        this.SET_NOTIFICATION_LIST(notifications || []);
    }

    @Mutation
    SET_NOTIFICATION_LIST(notificationList: Array<INotificationData>) {
        this.notificationList = notificationList;
    }

    @Action
    setLoadingIndicator(showLoadingIndicator: boolean) {
        this.SET_SHOW_LOADING_INDICATOR(showLoadingIndicator);
    }

    @Mutation
    SET_SHOW_LOADING_INDICATOR(showLoadingIndicator: boolean) {
        this.showLoadingIndicator = showLoadingIndicator;
    }

    @Action
    toggleChatPopup(isShowChatPopup: boolean) {
        this.SET_CHAT_POPUP(isShowChatPopup);
    }

    @Mutation
    SET_CHAT_POPUP(isShowChatPopup: boolean) {
        this.isShowChatPopup = isShowChatPopup;
    }
}
export const commonModule = getModule(CommonModule);
