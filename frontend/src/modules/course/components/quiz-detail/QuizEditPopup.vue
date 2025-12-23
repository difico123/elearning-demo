<template>
    <el-dialog
        :width="'80%'"
        z-index="600"
        v-model="isShow"
        @close="closePopup"
        :modal="false"
        :title="
            isCreateMode
                ? $t('course.quiz.form.addQuiz')
                : $t('course.quiz.form.editQuiz')
        "
    >
        <div class="d-flex flex-column gap-3 popup-body px-3">
            <div class="d-flex flex-column gap-1 quiz-fields">
                <div class="d-flex flex-row align-items-center gap-3 quiz-field">
                    <span class="quiz-label fw-bold"
                        >{{ $t('course.quiz.form.title') }}:</span
                    >
                    <div
                        class="quiz-content-wrapper flex-1 d-flex flex-row align-items-center gap-2"
                    >
                        <el-input
                            v-if="isEditingQuizName"
                            size="small"
                            class="flex-1"
                            v-model="formData.name"
                            :placeholder="$t('course.quiz.form.title')"
                        />
                        <span v-else class="inline-text flex-1">{{
                            formData.name || '—'
                        }}</span>
                        <img
                            src="@/assets/course/icons/edit.svg"
                            width="16"
                            alt=""
                            class="action-icon"
                            style="cursor: pointer"
                            @click="isEditingQuizName = !isEditingQuizName"
                        />
                    </div>
                </div>
                <div class="d-flex flex-row align-items-center gap-3 quiz-field">
                    <span class="quiz-label fw-bold"
                        >{{ $t('course.quiz.form.quizDuration') }}:
                    </span>
                    <div
                        class="quiz-content-wrapper flex-1 d-flex flex-row align-items-center gap-2"
                    >
                        <el-input
                            v-if="isEditingQuizDuration"
                            size="small"
                            type="number"
                            :min="0"
                            class="flex-1"
                            v-model="formData.duration"
                            :placeholder="$t('course.quiz.form.quizDuration')"
                        />
                        <span v-else class="inline-text flex-1">
                            {{ formData.duration || 0 }}
                        </span>
                        <img
                            src="@/assets/course/icons/edit.svg"
                            width="16"
                            alt=""
                            class="action-icon"
                            style="cursor: pointer"
                            @click="isEditingQuizDuration = !isEditingQuizDuration"
                        />
                    </div>
                </div>
            </div>

            <div class="d-flex flex-column gap-3 question-list">
                <div
                    v-for="(question, qIndex) in formData.questionList"
                    :key="qIndex"
                    class="question-item"
                >
                    <div class="question-header d-flex flex-column gap-1">
                        <div
                            class="d-flex flex-row align-items-center gap-3 question-field"
                        >
                            <span class="question-label fw-bold">{{
                                `${$t('course.quiz.field.question')} ${qIndex + 1}:`
                            }}</span>
                            <div
                                class="question-content-wrapper flex-1 d-flex flex-row align-items-center gap-2"
                            >
                                <el-input
                                    v-if="question._isEditingName"
                                    size="small"
                                    class="flex-1"
                                    v-model="question.name"
                                    :placeholder="$t('course.quiz.form.title')"
                                />
                                <span v-else class="inline-text flex-1">
                                    {{
                                        question.name ||
                                        $t('course.quiz.field.addQuestionPlaceholder')
                                    }}
                                </span>
                                <img
                                    src="@/assets/course/icons/edit.svg"
                                    width="16"
                                    alt=""
                                    class="action-icon"
                                    style="cursor: pointer"
                                    @click="toggleQuestionName(qIndex)"
                                />
                                <img
                                    src="@/assets/course/icons/cancel.svg"
                                    width="18"
                                    alt=""
                                    class="action-icon"
                                    style="cursor: pointer"
                                    @click="handleDeleteQuestion(qIndex)"
                                />
                            </div>
                        </div>
                        <div
                            class="d-flex flex-row align-items-center gap-3 question-field"
                        >
                            <span class="mark-label fw-bold"
                                >{{ $t('course.quiz.questionType.selectType') }}:</span
                            >
                            <div
                                class="question-content-wrapper flex-1 d-flex flex-row align-items-center gap-2"
                            >
                                <el-select
                                    v-model="question.type"
                                    size="small"
                                    class="flex-1"
                                    @change="handleQuestionTypeChange(qIndex)"
                                >
                                    <el-option
                                        :label="$t('course.quiz.questionType.multipleChoice')"
                                        value="multiple_choice"
                                    />
                                    <el-option
                                        :label="$t('course.quiz.questionType.singleChoice')"
                                        value="single_choice"
                                    />
                                    <el-option
                                        :label="$t('course.quiz.questionType.shortAnswer')"
                                        value="short_answer"
                                    />
                                </el-select>
                            </div>
                        </div>
                        <div
                            class="d-flex flex-row align-items-center gap-3 question-field"
                        >
                            <span class="mark-label fw-bold"
                                >{{ $t('course.quiz.form.mark') }}:</span
                            >
                            <div
                                class="question-content-wrapper flex-1 d-flex flex-row align-items-center gap-2"
                            >
                                <el-input
                                    v-if="question._isEditingMark"
                                    size="small"
                                    type="number"
                                    :min="0"
                                    class="flex-1"
                                    v-model="question.mark"
                                    :placeholder="$t('course.quiz.form.mark')"
                                />
                                <span v-else class="inline-text flex-1">
                                    {{
                                        $t('course.quiz.form.mark', {
                                            mark: question?.mark || 0,
                                        })
                                    }}
                                </span>
                                <img
                                    src="@/assets/course/icons/edit.svg"
                                    width="16"
                                    alt=""
                                    class="action-icon"
                                    style="cursor: pointer"
                                    @click="toggleQuestionMark(qIndex)"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="answer-wrapper" v-if="question.type !== 'short_answer'">
                        <div
                            class="answer-card d-flex flex-row gap-3 align-items-center"
                            v-for="(answer, aIndex) in question.answerList"
                            :key="aIndex"
                        >
                            <el-checkbox
                                v-if="question.type !== 'single_choice'"
                                v-model="answer.isCorrect"
                                class="answer-checkbox"
                            />
                            <el-radio
                                v-else
                                v-model="singleChoiceCorrectAnswer[qIndex]"
                                :label="aIndex"
                                @change="handleSingleChoiceChange(qIndex, aIndex)"
                            />
                            <div
                                class="answer-content flex-1 d-flex flex-row align-items-center gap-2"
                            >
                                <el-input
                                    v-if="answer._isEditing"
                                    size="small"
                                    class="flex-1"
                                    v-model="answer.content"
                                    :placeholder="$t('course.quiz.field.addAnswer')"
                                />
                                <div v-else class="flex-1">
                                    {{ answer.content ? answer.content : '—' }}
                                </div>
                                <img
                                    src="@/assets/course/icons/edit.svg"
                                    width="16"
                                    alt=""
                                    class="action-icon"
                                    style="cursor: pointer"
                                    @click="toggleAnswerEdit(qIndex, aIndex)"
                                />
                                <img
                                    src="@/assets/course/icons/cancel.svg"
                                    width="18"
                                    alt=""
                                    class="action-icon"
                                    style="cursor: pointer"
                                    @click="handleDeleteAnswer(qIndex, aIndex)"
                                />
                            </div>
                        </div>
                        <div class="add-inline mt-2" @click="handleAddAnswer(qIndex)">
                            <img src="@/assets/course/icons/plus.svg" width="18" alt="" />
                            <span>{{ $t('course.quiz.form.addAnswer') }}</span>
                        </div>
                    </div>
                    <div class="answer-wrapper" v-else>
                        <div class="d-flex flex-row align-items-center gap-3 answer-card">
                            <span class="fw-bold">{{ $t('course.quiz.correctAnswer') }}:</span>
                            <div class="flex-1">
                                <el-input
                                    v-if="question.answerList && question.answerList[0] && question.answerList[0]._isEditing"
                                    size="small"
                                    class="flex-1"
                                    v-model="question.answerList[0].content"
                                    :placeholder="$t('course.quiz.correctAnswer')"
                                />
                                <div v-else class="inline-text flex-1">
                                    {{ question.answerList && question.answerList[0] ? question.answerList[0].content : '—' }}
                                </div>
                            </div>
                            <img
                                src="@/assets/course/icons/edit.svg"
                                width="16"
                                alt=""
                                class="action-icon"
                                style="cursor: pointer"
                                @click="toggleShortAnswerEdit(qIndex)"
                            />
                        </div>
                    </div>
                </div>

                <div class="add-inline" @click="handleAddQuestion">
                    <img src="@/assets/course/icons/plus.svg" width="18" alt="" />
                    <span>{{ $t('course.quiz.form.addQuestion') }}</span>
                </div>
            </div>
        </div>
        <div class="action-area d-flex flex-row w-100 justify-content-end gap-3 pt-4">
            <div
                class="button save"
                :class="{ disabled: hasActiveEdit }"
                @click="handleSave"
            >
                {{ $t('course.quiz.form.save') }}
            </div>
            <div class="button cancel" @click="closePopup">
                {{ $t('course.quiz.form.cancel') }}
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import BaseInputText from '@/components/base/InputText.vue';
import BaseInputNumber from '@/components/base/InputNumber.vue';
import {
    IQuizDetail,
    IQuestionDetail,
    IAnswerDetail,
} from '../../constants/course.interfaces';
import { showErrorNotificationFunction } from '@/common/helpers';

@Options({
    components: { BaseInputText, BaseInputNumber },
})
export default class QuizEditPopup extends Vue {
    isShow = false;
    isEditingQuizName = false;
    isEditingQuizDuration = false;
    isCreateMode = false;
    formData: IQuizDetail = {
        name: '',
        duration: '',
        questionList: [],
    };
    originalQuiz: IQuizDetail = {};
    quizId = 0;
    courseId = 0;
    deletedQuestionIds: number[] = [];
    deletedAnswerIds: number[] = [];
    singleChoiceCorrectAnswer: { [qIndex: number]: number } = {};

    get hasActiveEdit(): boolean {
        if (this.isEditingQuizName || this.isEditingQuizDuration) {
            return true;
        }
        return (this.formData.questionList || []).some((q) => {
            if (q._isEditingName || q._isEditingMark) {
                return true;
            }
            return (q.answerList || []).some((a) => a._isEditing);
        });
    }

    openPopup(quiz: IQuizDetail | null, courseId: number) {
        this.courseId = courseId;
        this.isCreateMode = !quiz;
        if (quiz) {
            this.quizId = quiz.id || 0;
            this.originalQuiz = JSON.parse(JSON.stringify(quiz));
            this.formData = {
                name: quiz.name || '',
                duration: quiz.duration || '',
                questionList: (quiz.questionList || []).map((q, qIdx) => {
                    const questionType = q.type || 'multiple_choice';
                    // Find the correct answer index for single choice
                    const correctIndex = q.answerList?.findIndex((a) => a.isCorrect) ?? -1;
                    if (questionType === 'single_choice' && correctIndex >= 0) {
                        this.singleChoiceCorrectAnswer[qIdx] = correctIndex;
                    }
                    // Ensure short answer has exactly one answer
                    let answerList = (q.answerList || []).map((a) => ({
                        ...a,
                        _isEditing: false,
                    }));
                    if (questionType === 'short_answer') {
                        if (answerList.length === 0) {
                            answerList = [{ content: '', isCorrect: true, _isEditing: false }];
                        } else if (answerList.length > 1) {
                            answerList = [answerList[0]];
                            answerList[0].isCorrect = true;
                        } else {
                            answerList[0].isCorrect = true;
                        }
                    }
                    return {
                        ...q,
                        type: questionType,
                        _isEditingName: false,
                        _isEditingMark: false,
                        answerList,
                    };
                }),
            };
        } else {
            this.quizId = 0;
            this.originalQuiz = {};
            this.formData = {
                name: '',
                duration: '',
                questionList: [],
            };
        }
        this.deletedQuestionIds = [];
        this.deletedAnswerIds = [];
        this.isEditingQuizName = false;
        this.isEditingQuizDuration = false;
        this.isShow = true;
    }

    closePopup() {
        this.isShow = false;
        this.isCreateMode = false;
        this.formData = {
            name: '',
            duration: '',
            questionList: [],
        };
        this.originalQuiz = {};
        this.deletedQuestionIds = [];
        this.deletedAnswerIds = [];
        this.quizId = 0;
        this.singleChoiceCorrectAnswer = {};
    }

    handleAddQuestion() {
        if (!this.formData.questionList) {
            this.formData.questionList = [];
        }
        this.formData.questionList.push({
            name: '',
            mark: 0,
            type: 'multiple_choice',
            quizId: this.quizId,
            answerList: [],
        });
    }

    handleQuestionTypeChange(qIndex: number) {
        const question = this.formData.questionList?.[qIndex];
        if (!question) return;

        if (question.type === 'short_answer') {
            // Reset to blank answer when switching to short_answer
            question.answerList = [{
                content: '',  // Reset to blank
                isCorrect: true,
                _isEditing: false,
            }];
        } else if (question.type === 'single_choice') {
            // Preserve answers when switching to single_choice
            // Just ensure only one is correct
            if (question.answerList && question.answerList.length > 0) {
                const correctCount = question.answerList.filter(a => a.isCorrect).length;
                if (correctCount === 0) {
                    question.answerList[0].isCorrect = true;
                } else if (correctCount > 1) {
                    // Keep only the first correct answer
                    let foundFirst = false;
                    question.answerList.forEach(a => {
                        if (a.isCorrect && !foundFirst) {
                            foundFirst = true;
                        } else if (a.isCorrect) {
                            a.isCorrect = false;
                        }
                    });
                }
            }
        }
        // For multiple_choice, no changes needed - preserve all answers
    }

    toggleShortAnswerEdit(qIndex: number) {
        const question = this.formData.questionList?.[qIndex];
        if (!question || !question.answerList || question.answerList.length === 0) {
            return;
        }
        if (question.answerList[0]._isEditing === undefined) {
            question.answerList[0]._isEditing = false;
        }
        question.answerList[0]._isEditing = !question.answerList[0]._isEditing;
    }

    handleSingleChoiceChange(qIndex: number, aIndex: number) {
        const question = this.formData.questionList?.[qIndex];
        if (!question || !question.answerList) {
            return;
        }
        // Uncheck all answers, then check the selected one
        question.answerList.forEach((answer, idx) => {
            answer.isCorrect = idx === aIndex;
        });
    }

    handleDeleteQuestion(qIndex: number) {
        if (this.formData.questionList && this.formData.questionList[qIndex]) {
            const toDelete = this.formData.questionList[qIndex];
            if (toDelete.id) {
                this.deletedQuestionIds.push(toDelete.id);
            }
            this.formData.questionList.splice(qIndex, 1);
        }
    }

    handleAddAnswer(qIndex: number) {
        if (this.formData.questionList && this.formData.questionList[qIndex]) {
            if (!this.formData.questionList[qIndex].answerList) {
                this.formData.questionList[qIndex].answerList = [];
            }
            this.formData.questionList[qIndex].answerList!.push({
                content: '',
                isCorrect: false,
                questionId: this.formData.questionList[qIndex].id,
            });
        }
    }

    handleDeleteAnswer(qIndex: number, aIndex: number) {
        if (
            this.formData.questionList &&
            this.formData.questionList[qIndex] &&
            this.formData.questionList[qIndex].answerList
        ) {
            const answer = this.formData.questionList[qIndex].answerList![aIndex];
            if (answer?.id) {
                this.deletedAnswerIds.push(answer.id);
            }
            this.formData.questionList[qIndex].answerList!.splice(aIndex, 1);
        }
    }

    toggleQuestionName(qIndex: number) {
        if (this.formData.questionList && this.formData.questionList[qIndex]) {
            this.formData.questionList[qIndex]._isEditingName =
                !this.formData.questionList[qIndex]._isEditingName;
        }
    }

    toggleQuestionMark(qIndex: number) {
        if (this.formData.questionList && this.formData.questionList[qIndex]) {
            this.formData.questionList[qIndex]._isEditingMark =
                !this.formData.questionList[qIndex]._isEditingMark;
        }
    }

    toggleAnswerEdit(qIndex: number, aIndex: number) {
        if (
            this.formData.questionList &&
            this.formData.questionList[qIndex] &&
            this.formData.questionList[qIndex].answerList &&
            this.formData.questionList[qIndex].answerList![aIndex]
        ) {
            this.formData.questionList[qIndex].answerList![aIndex]._isEditing =
                !this.formData.questionList[qIndex].answerList![aIndex]._isEditing;
        }
    }

    handleSave() {
        if (this.hasActiveEdit) {
            return;
        }

        // Validate questions based on type and show user-friendly errors
        const errors: string[] = [];
        for (let i = 0; i < (this.formData.questionList || []).length; i++) {
            const question = this.formData.questionList![i];
            const type = question.type || 'multiple_choice';
            const questionName = question.name || `Question ${i + 1}`;
            const answerList = (question.answerList || []).filter(
                (a) => a.content && a.content.trim().length > 0,
            );
            const correctAnswers = answerList.filter(a => a.isCorrect);

            if (type === 'short_answer') {
                if (answerList.length !== 1) {
                    errors.push(
                        `Question '${questionName}': Short answer questions must have exactly 1 answer`,
                    );
                } else if (!answerList[0].isCorrect) {
                    errors.push(
                        `Question '${questionName}': Short answer question must have isCorrect set to true`,
                    );
                }
            } else if (type === 'single_choice') {
                if (answerList.length < 2) {
                    errors.push(
                        `Question '${questionName}': Single choice questions must have at least 2 answers`,
                    );
                } else if (correctAnswers.length !== 1) {
                    errors.push(
                        `Question '${questionName}': Single choice questions must have exactly 1 correct answer`,
                    );
                }
            } else {
                // Multiple choice: at least 1 answer required (0 correct answers allowed)
                if (answerList.length === 0) {
                    errors.push(
                        `Question '${questionName}': Each question must have at least 1 answer with content`,
                    );
                }
            }
        }

        if (errors.length > 0) {
            showErrorNotificationFunction(errors.join('\n'));
            return;
        }

        this.$emit('save', {
            quizId: this.quizId,
            courseId: this.courseId,
            quiz: {
                name: this.formData.name,
                duration: this.formData.duration,
            },
            questions: this.formData.questionList || [],
            deletedQuestions: this.deletedQuestionIds,
            deletedAnswers: this.deletedAnswerIds,
        });
        this.closePopup();
    }
}
</script>

<style lang="scss" scoped>
.popup-body {
    max-height: 50vh;
    overflow-y: auto;
}

.action-area {
    margin-top: 20px;
    border-top: 1px solid #e0e0e0;
    padding-top: 16px;
}

.button {
    padding: 8px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;

    &.save {
        background-color: $color-violet-new-1;
        color: $color-white;

        &:hover:not(.disabled) {
            background-color: $color-violet-new-opacity-50;
        }

        &.disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    &.cancel {
        background-color: #e8e8e8;
        color: #000;

        &:hover {
            background-color: #f3f3f3;
        }
    }
}

.question-list {
    .question-item {
        margin-bottom: 16px;
    }
}

.quiz-fields {
    .quiz-field {
        font-size: 16px;
        line-height: 200%;
    }
}

.quiz-label {
    flex-shrink: 0;
}

.question-header {
    font-size: 16px;
    line-height: 200%;
    margin-bottom: 8px;
}

.question-field {
    font-size: 16px;
    line-height: 200%;
}

.question-label {
    flex-shrink: 0;
    font-weight: 600;
}

.question-content-wrapper {
    min-width: 0;
}

.mark-label {
    flex-shrink: 0;
    font-weight: 600;
}

.answer-wrapper {
    flex-wrap: wrap;
}

.answer-card {
    font-size: 16px;
    line-height: 200%;
    margin-bottom: 8px;
}

.answer-checkbox {
    flex-shrink: 0;
    margin-top: 2px;
}

.answer-content {
    min-width: 0;

    .inline-text {
        min-height: 24px;
        display: flex;
        align-items: center;
    }
}

.action-icon {
    flex-shrink: 0;
    margin-top: 4px;
}

.add-inline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: $color-violet-new-1;
    font-weight: 600;
}

.flex-1 {
    flex: 1 1 0;
    min-width: 0;
}

.inline-text {
    word-break: break-word;
}
</style>
