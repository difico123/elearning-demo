<template>
    <el-dialog
        :width="'70%'"
        z-index="600"
        v-model="isShowTopicFormPopup"
        @close="closeTopicFormPopup"
        @opened="handleDialogOpen"
        :modal="false"
        :title="
            isCreate
                ? $t('course.topic.action.createTitle')
                : $t('course.topic.action.editTitle')
        "
    >
        <div class="d-flex flex-row justify-content-between" style="gap: 5vw">
            <div class="form-left" style="width: 40%">
                <BaseInputText
                    class="input"
                    clearable="true"
                    :label="$t('course.topic.form.title')"
                    :placeholder="$t('course.topic.form.title')"
                    v-model:value="selectedTopic.name"
                />
                <BaseInputText
                    class="input"
                    :label="$t('course.topic.form.description')"
                    :placeholder="$t('course.topic.form.description')"
                    v-model:value="selectedTopic.description"
                />
                <!-- <div class="d-flex flex-row gap-3 justify-content-start">
                    <label class="fw-bold text-start mb-2 d-flex align-items-center pt-4">
                        {{ $t('course.topic.form.video') }}
                    </label>
                    <label class="upload-button" for="file-input">
                        <div class="upload-wrapper">
                            <img src="@/assets/course/icons/upload.png" alt="" />
                        </div>
                    </label>
                </div> -->
                <input
                    type="file"
                    accept="video/*"
                    id="file-input"
                    class="d-none"
                    @change="handleFileUpload($event)"
                />
                <video
                    id="video-preview"
                    controls
                    class="pt-2"
                    v-if="video != ''"
                    :src="typeof video === 'string' ? video : ''"
                />
            </div>
            <div @focus.stop class="form-right" style="flex: 1 1 0">
                <label class="fw-bold text-start mb-2 d-flex align-items-center">
                    {{ $t('course.topic.form.content') }}
                </label>
                <editor
                    v-model="selectedTopic.content"
                    api-key="500pb1ogequk30ef9qpcv5rw55vqb8xlkonwp9enq1crafq2"
                    :init="toolbarInit"
                />
            </div>
        </div>
        <div class="action-area d-flex flex-row w-100 justify-content-end gap-3 pt-4">
            <div v-if="!isCreate" class="button delete" @click="handleDeleteTopic">
                {{ $t('course.topic.form.delete') }}
            </div>
            <div class="button save" @click="handleSubmitTopic">
                {{ $t('course.topic.form.save') }}
            </div>
            <div class="button cancel" @click="closeTopicFormPopup">
                {{ $t('course.topic.form.cancel') }}
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import {
    showErrorNotificationFunction,
    showSuccessNotificationFunction,
} from '@/common/helpers';
import { commonModule } from '@/modules/common/store/common.store';
import { Options, Vue } from 'vue-class-component';
import { ITopicData } from '../../constants/course.interfaces';
import {
    createTopic,
    deleteTopic,
    getTopicList,
    updateTopic,
} from '../../services/course';
import { courseModule } from '../../store/course.store';
import Editor from '@tinymce/tinymce-vue';

@Options({
    components: { Editor },
})
export default class TopicFormPopup extends Vue {
    video: string | File = '';
    selectedTopic: ITopicData = {};

    get toolbarInit() {
        return {
            plugins:
                'anchor autolink charmap codesample emoticons image link lists media searchreplace table wordcount linkchecker',
            toolbar:
                'insertfile undo redo | fontselect fontsizeselect | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor',
            toolbar_mode: 'sliding',
            height: 420,
            resize: false,
            fontsize_formats:
                '8pt 9pt 10pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 20pt 24pt 36pt 48pt',
        };
    }

    get isShowTopicFormPopup() {
        return courseModule.isShowTopicFormPopup;
    }

    get popupMode() {
        return courseModule.topicFormPopupMode;
    }

    get isCreate() {
        return this.popupMode === 'create';
    }

    handleDialogOpen() {
        console.log('handleDialogOpen called (from @opened event)');
        // This fires when the dialog is fully opened - ensure data is loaded
        this.$nextTick(() => {
            console.log('Calling updateSelectedTopic from handleDialogOpen');
            this.updateSelectedTopic();
        });
    }

    mounted() {
        console.log('TopicFormPopup mounted');
        // Watch for popup visibility changes
        this.$watch(
            () => this.isShowTopicFormPopup,
            (newVal: boolean, oldVal: boolean) => {
                console.log('isShowTopicFormPopup changed:', { newVal, oldVal });
                if (newVal) {
                    this.$nextTick(() => {
                        console.log('Calling updateSelectedTopic from isShowTopicFormPopup watcher');
                        this.updateSelectedTopic();
                    });
                }
            },
        );
        // Watch for mode changes
        this.$watch(
            () => this.popupMode,
            (newVal: string, oldVal: string) => {
                console.log('popupMode changed:', { newVal, oldVal, isShow: this.isShowTopicFormPopup });
                if (this.isShowTopicFormPopup) {
                    this.$nextTick(() => {
                        console.log('Calling updateSelectedTopic from popupMode watcher');
                        this.updateSelectedTopic();
                    });
                }
            },
        );
    }

    updateSelectedTopic() {
        console.log('updateSelectedTopic called', {
            isCreate: this.isCreate,
            selectedTopic: courseModule.selectedTopic,
            popupMode: this.popupMode,
        });

        if (this.isCreate) {
            // Reset to empty for create mode
            this.selectedTopic.name = '';
            this.selectedTopic.description = '';
            this.selectedTopic.content = '';
            this.selectedTopic.video = '';
            this.selectedTopic.id = undefined;
            this.selectedTopic.courseId = undefined;
            this.video = '';
        } else {
            // Edit mode - copy data from store
            const topic = courseModule.selectedTopic;
            console.log('Topic from store:', topic);
            
            if (!topic || !topic.id) {
                console.warn('No topic selected or topic has no id');
                this.selectedTopic.name = '';
                this.selectedTopic.description = '';
                this.selectedTopic.content = '';
                this.selectedTopic.video = '';
                this.video = '';
                return;
            }
            
            // Update properties directly to maintain reactivity
            this.selectedTopic.id = topic.id;
            this.selectedTopic.courseId = topic.courseId;
            this.selectedTopic.name = topic.name || '';
            this.selectedTopic.description = topic.description || '';
            this.selectedTopic.content = topic.content || '';
            this.selectedTopic.video = topic.video || '';
            
            console.log('Updated selectedTopic:', this.selectedTopic);
            
            // If there's an existing video URL, show it in the preview
            if (topic.video) {
                this.video = topic.video;
                this.$nextTick(() => {
                    this.previewExistingVideo();
                });
            } else {
                this.video = '';
            }
        }
    }

    previewExistingVideo() {
        this.previewVideo();
    }

    closeTopicFormPopup() {
        courseModule.toggleShowTopicFormPopup(false);
    }

    handleFileUpload(event: any) {
        this.video = event.target.files[0];
        this.previewVideo();
    }

    previewVideo() {
        let video: any = document.getElementById('video-preview');
        if (!video) return;

        if (this.video instanceof File) {
            let reader = new FileReader();
            reader.readAsDataURL(this.video);
            reader.addEventListener('load', function () {
                video.src = reader.result;
            });
        } else if (typeof this.video === 'string') {
            video.src = this.video;
        }
    }

    async reloadTopicList() {
        commonModule.setLoadingIndicator(true);
        const id: number = +this.$route.params.courseId;
        const response = await getTopicList(id);
        if (response.success) {
            courseModule.setTopicList(response?.data?.items || []);
            if (response?.data?.items && response?.data?.items.length > 0) {
                courseModule.setSelectedTopic(response.data.items[0]);
                courseModule.setCurrentChatTopicId(response.data.items[0]?.id || -1);
            } else {
                courseModule.setSelectedTopicObject({});
            }
        } else {
            let res = response?.errors || [
                { message: this.$t('course.errors.getTopicListError') },
            ];
            courseModule.setTopicList([]);
            showErrorNotificationFunction(res[0].message);
        }
        await this.closeTopicFormPopup();
        commonModule.setLoadingIndicator(false);
    }

    async handleSubmitTopic() {
        commonModule.setLoadingIndicator(true);
        const topicData: ITopicData = {
            name: this.selectedTopic.name,
            description: this.selectedTopic.description,
            content: this.selectedTopic.content,
        };
        let formData = new FormData();
        const courseId = +this.$route.params.courseId;
        const { name, description, content } = topicData;

        formData.append('name', name || '');
        formData.append('description', description || '');
        formData.append('content', content as string);

        console.log(name, 'name');
        console.log(description, 'description');
        console.log(content, 'content');

        if (this.video) {
            formData.append('file', this.video || '');
        }
        if (this.isCreate) {
            const response = await createTopic(formData, courseId);
            if (response.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.topic.createTopic'),
                );
                await this.reloadTopicList();
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.topic.createTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        } else {
            const topicId = this.selectedTopic.id;
            if (!topicId) {
                showErrorNotificationFunction(this.$t('course.errors.topic.editTopic'));
                commonModule.setLoadingIndicator(false);
                return;
            }
            const response = await updateTopic(formData, courseId, topicId as number);
            if (response.success) {
                showSuccessNotificationFunction(
                    this.$t('course.success.topic.updateTopic'),
                );
                await this.reloadTopicList();
            } else {
                let res = response?.errors || [
                    { message: this.$t('course.errors.topic.editTopic') },
                ];
                showErrorNotificationFunction(res[0].message);
            }
        }
        commonModule.setLoadingIndicator(false);
    }

    async handleDeleteTopic() {
        commonModule.setLoadingIndicator(true);
        const courseId = +this.$route.params.courseId;
        const response = await deleteTopic(courseId, this.selectedTopic.id as number);
        if (response.success) {
            showSuccessNotificationFunction(this.$t('course.success.topic.deleteTopic'));
            await this.reloadTopicList();
        } else {
            let res = response.errors || [
                { message: this.$t('course.errors.topic.deleteTopic') },
            ];
            showErrorNotificationFunction(res[0].message);
        }
        commonModule.setLoadingIndicator(false);
    }
}
</script>
<style lang="scss" scoped>
.button {
    font-size: 17px !important;
    font-weight: 600 !important;
    line-height: 24px !important;
    border-radius: 6px;
    white-space: nowrap;
    padding: 8px 20px;
    transition: all 0.44s ease 0s;
    cursor: pointer;
}

.save {
    background-color: #6d79e8;
    color: #fff;
}

.save:hover {
    background-color: #4057d08d;
}

.cancel {
    background-color: #f7f7f7;
    color: #000;
}

.cancel:hover {
    background-color: #f2f2f2;
}

.delete {
    background: red;
    color: $color-white;

    &:hover {
        background: #ff4122;
    }
}

.upload-wrapper {
    cursor: pointer;
    background-color: #aaa;
    border: 1px solid #888;
}
</style>
