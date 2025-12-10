import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex/index';
import {
    IAnswerDetail,
    ICourseData,
    ICoursePreviewData,
    IMessageDetail,
    IQuizDetail,
    IStudentRankData,
    ITopicData,
} from '../constants/course.interfaces';
import { CourseListDisplayMode } from '../constants/course.constants';

@Module({ dynamic: true, namespaced: true, store, name: 'Course' })
class CourseModule extends VuexModule {
    courseList: Array<ICourseData> = [];
    courseListDisplayMode = CourseListDisplayMode.GRID;
    coursePreviewData: ICoursePreviewData = {};
    topicList: Array<ITopicData> = [];
    selectedTopic: ITopicData = this.topicList.length > 0 ? this.topicList[0] : {};
    topicSidebarMode = '';
    courseSidebarMode = '';
    quizSidebarMode = '';
    courseArea = '';
    isShowTopicVideo = false;
    isShowTopicFormPopup = false;
    quizList: Array<IQuizDetail> = [];
    topicId = 1;
    isAddingQuiz = false;
    messageList: Array<IMessageDetail> = [];
    currentChatTopicId = -1;
    topicFormPopupMode = '';
    unreadMessageCount = 0;
    courseRating = 1;
    quizAnswerList: Array<IAnswerDetail> = [];
    studentRankingList: Array<IStudentRankData> = [];

    @Action
    setCourseList(courseList: Array<ICourseData>) {
        this.SET_COURSE_LIST(courseList || []);
    }

    @Mutation
    SET_COURSE_LIST(courseList: Array<ICourseData>) {
        this.courseList = courseList;
    }

    @Action
    setCourseListDisplayMode(mode: string) {
        this.SET_COURSE_LIST_DISPLAY_MODE(mode);
    }

    @Mutation
    SET_COURSE_LIST_DISPLAY_MODE(mode: string) {
        this.courseListDisplayMode = mode;
    }

    @Action
    setCoursePreviewData(coursePreviewData: ICoursePreviewData) {
        this.SET_COURSE_PREVIEW_DATA(coursePreviewData);
    }

    @Mutation
    SET_COURSE_PREVIEW_DATA(coursePreviewData: ICoursePreviewData) {
        this.coursePreviewData = coursePreviewData;
    }

    @Action
    setTopicList(topicList: Array<ITopicData>) {
        this.SET_TOPIC_LIST(topicList || []);
    }

    @Mutation
    SET_TOPIC_LIST(topicList: Array<ITopicData>) {
        this.topicList = topicList;
    }

    @Action
    setSelectedTopic(topic: ITopicData) {
        this.SET_SELECTED_TOPIC(topic);
    }

    @Mutation
    SET_SELECTED_TOPIC(topic: ITopicData) {
        this.selectedTopic = topic;
    }

    @Action
    setTopicSidebarMode(mode: string) {
        this.SET_TOPIC_SIDEBAR_MODE(mode);
    }

    @Mutation
    SET_TOPIC_SIDEBAR_MODE(mode: string) {
        this.topicSidebarMode = mode;
    }

    @Action
    setCourseSidebarMode(mode: string) {
        this.SET_COURSE_SIDEBAR_MODE(mode);
    }

    @Mutation
    SET_COURSE_SIDEBAR_MODE(mode: string) {
        this.courseSidebarMode = mode;
    }

    @Action
    setSelectedTopicObject(selectedTopic: ITopicData) {
        this.SET_SELECTED_TOPIC_OBJECT(selectedTopic);
    }

    @Mutation
    SET_SELECTED_TOPIC_OBJECT(selectedTopic: ITopicData) {
        this.selectedTopic = selectedTopic;
    }

    @Action
    toggleShowTopicVideo(visible: boolean) {
        this.TOGGLE_SHOW_TOPIC_VIDEO(visible);
    }

    @Mutation
    TOGGLE_SHOW_TOPIC_VIDEO(visible: boolean) {
        this.isShowTopicVideo = visible;
    }

    @Action
    toggleShowTopicFormPopup(visible: boolean) {
        this.TOGGLE_SHOW_TOPIC_FORM_POPUP(visible);
    }

    @Mutation
    TOGGLE_SHOW_TOPIC_FORM_POPUP(visible: boolean) {
        this.isShowTopicFormPopup = visible;
    }

    @Action
    setQuizSidebarMode(mode: string) {
        this.SET_QUIZ_SIDEBAR_MODE(mode);
    }

    @Mutation
    SET_QUIZ_SIDEBAR_MODE(mode: string) {
        this.quizSidebarMode = mode;
    }

    @Action
    setCourseArea(area: string) {
        this.SET_COURSE_AREA(area);
    }

    @Mutation
    SET_COURSE_AREA(area: string) {
        this.courseArea = area;
    }

    @Action
    setQuizList(quizList: Array<IQuizDetail>) {
        this.SET_QUIZ_LIST(quizList || []);
    }

    @Mutation
    SET_QUIZ_LIST(quizList: Array<IQuizDetail>) {
        this.quizList = quizList;
    }

    @Action
    setTopicId(topicId: number) {
        this.SET_TOPIC_ID(topicId);
    }

    @Mutation
    SET_TOPIC_ID(topicId: number) {
        this.topicId = topicId;
    }

    @Action
    setAddingQuiz(state: boolean) {
        this.SET_ADDING_QUIZ(state);
    }

    @Mutation
    SET_ADDING_QUIZ(state: boolean) {
        this.isAddingQuiz = state;
    }

    @Action
    setMessageList(messageList: Array<IMessageDetail>) {
        this.SET_MESSAGE_LIST(messageList);
    }

    @Mutation
    SET_MESSAGE_LIST(messageList: Array<IMessageDetail>) {
        this.messageList = messageList;
    }

    @Action
    setCurrentChatTopicId(topicId: number) {
        this.SET_CURRENT_TOPIC_ID(topicId);
    }

    @Mutation
    SET_CURRENT_TOPIC_ID(topicId: number) {
        this.currentChatTopicId = topicId;
    }

    @Action
    setTopicFormPopupMode(mode: string) {
        this.SET_TOPIC_FORM_POPUP_MODE(mode);
    }

    @Mutation
    SET_TOPIC_FORM_POPUP_MODE(mode: string) {
        this.topicFormPopupMode = mode;
    }

    @Action
    incrementUnreadMessageCount() {
        this.INCREMENT_UNREAD_MESSAGE_COUNT();
    }

    @Mutation
    INCREMENT_UNREAD_MESSAGE_COUNT() {
        this.unreadMessageCount++;
    }

    @Action
    resetUnreadMessageCount() {
        this.RESET_UNREAD_MESSAGE_COUNT();
    }

    @Mutation
    RESET_UNREAD_MESSAGE_COUNT() {
        this.unreadMessageCount = 0;
    }

    @Action
    setCourseRating(rating: number) {
        this.SET_COURSE_RATING(rating);
    }

    @Mutation
    SET_COURSE_RATING(rating: number) {
        this.courseRating = rating;
    }

    @Action({ rawError: true })
    setQuizAnswerList(answerList: Array<IAnswerDetail>) {
        this.SET_QUIZ_ANSWER_LIST(answerList);
    }

    @Mutation
    SET_QUIZ_ANSWER_LIST(answerList: Array<IAnswerDetail>) {
        this.quizAnswerList = answerList;
    }

    @Action
    setStudentRankingList(studentRankingList: Array<IStudentRankData>) {
        this.SET_STUDENT_RANKING_LIST(studentRankingList);
    }

    @Mutation
    SET_STUDENT_RANKING_LIST(studentRankingList: Array<IStudentRankData>) {
        this.studentRankingList = studentRankingList;
    }
}
export const courseModule = getModule(CourseModule);
