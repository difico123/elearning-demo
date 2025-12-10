<template>
    <div class="course-list-table-wrapper d-flex w-100 flex-row align-items-center mb-2">
        <div class="d-flex w-100 flex-row align-items-center" style="gap: 2.5vw">
            <div class="course-list-table-title text" @click="sortTable('name')">
                {{ $t('course.table.title') }}
            </div>
            <div class="course-list-table-image"></div>
            <div
                class="course-list-table-description text"
                @click="sortTable('description')"
            >
                {{ $t('course.table.description') }}
            </div>
            <div
                class="course-list-table-rating d-flex flex-row align-items-center"
                @click="sortTable('avgRating')"
            >
                {{ $t('course.table.rating') }}
            </div>
            <div
                class="course-list-table-instructor"
                @click="sortTable('instructorName')"
            >
                {{ $t('course.table.instructor') }}
            </div>
            <div
                class="d-flex flex-row course-list-table-student"
                @click="sortTable('studentTotal')"
            >
                {{ $t('course.table.studentCount') }}
            </div>
        </div>
        <div class="price-tag" @click="sortTable('price')">
            {{ $t('course.table.price') }}
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ICourseData } from '../../constants/course.interfaces';
import { getPriceBackgroundColor } from '../../helpers/commonFunctions';
import { courseModule } from '../../store/course.store';
type ICourseDataKeys = keyof ICourseData;

@Options({
    components: {},
})
export default class CourseListItem extends Vue {
    @Prop({ default: '' }) readonly course!: ICourseData;
    getPriceBackgroundColor(price: number) {
        return getPriceBackgroundColor(price);
    }

    sortDesc = true;

    get courseList() {
        return courseModule.courseList;
    }

    sortTable(type: ICourseDataKeys = 'name') {
        this.sortDesc = !this.sortDesc;
        if (this.sortDesc) {
            courseModule.setCourseList(
                this.courseList.sort((a: ICourseData, b: ICourseData) => {
                    let sa = a[type] as string;
                    let sb = b[type] as string;
                    return sa > sb ? 1 : -1;
                }),
            );
        } else {
            courseModule.setCourseList(
                this.courseList.sort((a: ICourseData, b: ICourseData) => {
                    let sa = a[type] as string;
                    let sb = b[type] as string;
                    return sa < sb ? 1 : -1;
                }),
            );
        }
    }
}
</script>
<style lang="scss" scoped>
.course-list-table {
    &-wrapper {
        padding: 10px 32px;
        background-color: #ffffffdd;
        border-radius: 12px;
        cursor: pointer;
        color: #000;
        font-weight: bold;
        gap: 2.5vw;
    }

    &-image {
        width: 120px !important;
    }

    &-title {
        width: 16vw;
        font-size: 18px;
        font-weight: 600;
    }

    &-description {
        width: 20vw;
        font-weight: 600;
    }

    &-instructor {
        width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &-rating {
        width: 7vw;
    }
}

.text {
    display: block;
    display: -webkit-box;
    line-height: 150%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.price-tag {
    width: 80px !important;
    text-align: center;
    border-radius: 10px;
    color: #000;
}
</style>
