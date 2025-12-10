<template>
    <div class="d-flex flex-column gap-1">
        <div
            :style="[
                { 'padding-left': isOwnMessage(message) ? '3px' : '0' },
                { 'align-self': isOwnMessage(message) ? 'flex-end' : 'flex-start' },
                { color: instructorId === message.userId ? 'red' : 'black' },
            ]"
        >
            {{ message?.username }}
            <span v-if="instructorId === message.userId">{{
                $t('course.comment.instructor')
            }}</span>
        </div>
        <div class="comment-data hidden" v-if="isRevealed === 0">
            <span>{{ $t('course.comment.hidden') }}</span>
            <img
                style="margin-left: 4px; cursor: pointer"
                @click="revealComment"
                src="@/assets/course/icons/hide.png"
                width="12"
                alt=""
            />
        </div>
        <div
            v-if="isRevealed === 1"
            class="comment-data"
            :style="{
                'align-self': userId === message.userId ? 'flex-end' : 'flex-start',
            }"
        >
            {{ message?.comment }}
        </div>
    </div>
</template>

<script lang="ts">
import { userModule } from '@/modules/user/store/user.store';
import { ref } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IMessageDetail } from '../../constants/course.interfaces';
import { courseModule } from '../../store/course.store';

@Options({
    components: {},
})
export default class CommentData extends Vue {
    @Prop({ default: {} }) readonly message!: IMessageDetail;
    get instructorId() {
        return courseModule.coursePreviewData.course?.instructorId;
    }
    isRevealed = -1;
    get userId() {
        return userModule.userData.id;
    }
    isOwnMessage(message: IMessageDetail) {
        return message.userId === this.userId;
    }

    revealComment() {
        console.log(this.isRevealed, 'before');
        this.isRevealed = 1;
        console.log(this.isRevealed, 'after');
    }

    mounted() {
        this.isRevealed = 1 - this.message?.isBad;
    }
}
</script>

<style lang="scss" scoped>
.comment-data {
    padding: 4px 8px;
    background: $color-white;
    border-radius: 5px;
    font-weight: 500;
    line-height: 175%;
}

.hidden {
    background: $color-violet-04;
    font-size: 13px;
    font-style: italic;
    font-weight: 300;
}
</style>
