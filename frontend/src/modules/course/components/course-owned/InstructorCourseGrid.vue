<template>
    <div class="course-grid-wrapper w-100 d-flex flex-row justify-content-between">
        <UserCourseGridItem
            v-for="course in instructorCourseList"
            :key="course.id"
            :course="course"
        />
        <div class="filler"></div>
        <div class="filler"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { userCourseModule } from '../../store/user-course.store';
import UserCourseGridItem from './UserCourseGridItem.vue';

@Options({
    components: { UserCourseGridItem },
})
export default class InstructorCourseGrid extends Vue {
    get instructorCourseList() {
        return userCourseModule.instructorCourseList;
    }
}
</script>
<style lang="scss" scoped>
.course-grid-wrapper {
    flex-wrap: wrap;
    gap: 24px;
}

.filler {
    width: 374px;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
}
</style>
