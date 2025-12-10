<template>
    <div
        v-if="studentRankingList.length > 0"
        class="leaderboard-wrapper d-flex flex-column"
    >
        <div class="leaderboard-title">{{ $t('course.quiz.leaderboard') }}</div>
        <div class="leaderboard-content">
            <div class="d-flex flex-column">
                <div
                    v-for="(student, index) in studentRankingList.slice(0, 9)"
                    :key="student.id"
                >
                    <div
                        :class="[
                            { 'leaderboard-grandmaster pro': index === 0 },
                            { 'leaderboard-master pro': index === 1 || index === 2 },
                            { 'leaderboard-hacker pro': index > 2 },
                        ]"
                    >
                        <div class="text-ellipsis">{{ student?.username }}</div>
                        <div class="leaderboard-point">{{ student?.totalMark }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { courseModule } from '../../store/course.store';

@Options({})
export default class Leaderboard extends Vue {
    get studentRankingList() {
        return courseModule.studentRankingList;
    }
}
</script>
<style lang="scss" scoped>
.pro {
    padding: 12px 15px;
    font-weight: 500 !important;
    border-bottom: 1px solid $color-violet-new-1;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
}
.leaderboard {
    &-wrapper {
        width: 450px;
        filter: drop-shadow(3px 4px 26px $color-violet-new-1);
    }

    &-title {
        background-color: $color-violet-new-1;
        font-size: 19px;
        font-weight: 600;
        padding: 12px;
        border-left: 5px solid orangered;
        color: #f8f8f8;
    }

    &-content {
        background-color: #f0f0f0;
        display: flex;
        flex-flow: column nowrap;
    }

    &-grandmaster {
        animation: colorRotate 10s linear 0s infinite;
        font-weight: bold !important;
        @keyframes colorRotate {
            from {
                color: red;
            }
            16% {
                color: yellow;
            }
            33% {
                color: green;
            }
            50% {
                color: lightblue;
            }
            66% {
                color: blue;
            }
            83% {
                color: purple;
            }
            100% {
                color: red;
            }
        }
    }

    &-master {
        color: red;
    }

    &-hacker {
        color: orange;
    }

    &-point {
        font-weight: 400;
    }
}

.text-ellipsis {
    max-width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
