<template>
    <div class="course-grid-wrapper w-100 d-flex flex-row justify-content-between">
        <CourseGridItem v-for="course in courseList" :key="course.id" :course="course" />
        <div class="filler"></div>
        <div class="filler"></div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { courseModule } from '../../store/course.store';
import CourseGridItem from './CourseGridItem.vue';

@Options({
    components: { CourseGridItem },
})
export default class CourseGrid extends Vue {
    get courseList() {
        return courseModule.courseList;
    }

    created() {
        window.scrollTo(0, 0);
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
