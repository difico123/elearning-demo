<template>
    <div class="course-list-wrapper w-100 d-flex justify-content-between">
        <UserCourseListItem
            v-for="course in instructorCourseList"
            :key="course.id"
            :course="course"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { userCourseModule } from '../../store/user-course.store';
import UserCourseListItem from './UserCourseListItem.vue';

@Options({
    components: { UserCourseListItem },
})
export default class InstructorCourseList extends Vue {
    get instructorCourseList() {
        return userCourseModule.instructorCourseList;
    }
}
</script>
<style lang="scss" scoped>
.course-list-wrapper {
    flex-wrap: wrap;
    gap: 16px;
}
</style>
