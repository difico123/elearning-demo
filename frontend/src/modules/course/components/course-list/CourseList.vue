<template>
    <div class="course-list-wrapper w-100 d-flex justify-content-between">
        <CourseListItem v-for="course in courseList" :key="course.id" :course="course" />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { courseModule } from '../../store/course.store';
import CourseListItem from './CourseListItem.vue';

@Options({
    components: { CourseListItem },
})
export default class CourseList extends Vue {
    get courseList() {
        return courseModule.courseList;
    }

    async created() {
        window.scrollTo(0, 0);
    }
}
</script>
<style lang="scss" scoped>
.course-list-wrapper {
    flex-wrap: wrap;
    gap: 16px;
}

@media only screen and (max-width: map-get($map: $grid-breakpoints, $key: md)) {
}
</style>
