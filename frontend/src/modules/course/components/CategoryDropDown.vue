<template>
    <div class="select-language d-flex">
        <el-dropdown>
            <div class="d-flex align-items-center" style="cursor: pointer">
                <span
                    class="dropdown-selected d-flex justify-content-end"
                    style="gap: 10px"
                >
                    <img
                        :src="selectedCategory.image"
                        alt=""
                        v-if="!!selectedCategory.image"
                        :width="30"
                    />

                    {{
                        selectedCategory.name
                            ? selectedCategory.name
                            : $t(`course.course.selectCategory`)
                    }}
                </span>
                <img src="@/assets/common/icons/header/header-select-arrow.svg" alt="" />
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item
                        v-for="category in categoryList"
                        :key="category.id"
                        @click="changeCategory(category)"
                    >
                        <div class="dropdown-item d-flex align-items-center">
                            <img :src="category.image" alt="" :width="20" />
                            <span class="dropdown-item-text">
                                {{ category.name }}
                            </span>
                        </div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import { SupportLanguage, DEFAULT_LANGUAGE } from '@/common/constants';
import { landingModule } from '@/modules/landing/store/landing.store';
import { ICategoryData } from '@/modules/landing/constants/landing.interfaces';

@Options({})
export default class CategoryDropDown extends Vue {
    languages = Object.values(SupportLanguage);

    selectedLanguage = DEFAULT_LANGUAGE;

    selectedCategory: ICategoryData = {
        id: 0,
        name: '',
        image: '',
        avgRating: 0,
        courseTotal: 0,
        studentTotal: 0,
    };

    changeCategory = (data: ICategoryData) => {
        this.selectedCategory = data;
        this.$emit('select-category', data.id);
    };

    get categoryList() {
        return landingModule.categoryList;
    }
}
</script>

<style lang="scss" scoped>
.select-language {
    padding: 10px 20px;
    border-radius: 10px;
    background: #e9e9e9;
}
.dropdown-selected,
.dropdown-item-text {
    min-width: 85px;
    font-size: 17px;
    font-weight: 400;
    line-height: 25.5px;
    color: $color-blue-extra;
}
.dropdown-selected {
    margin-right: 7.5px;
    white-space: nowrap;
    align-self: flex-end;
}
.dropdown-item {
    height: 40px;
    padding: 0 20px 0 10px;
}
.dropdown-item:hover {
    background-color: $color-violet-03;
    .dropdown-item-text {
        color: $color-violet-new-1;
        left: 0;
    }
}
.el-dropdown-menu {
    &,
    :deep(.el-dropdown-menu__item) {
        padding: 0;
    }
    &,
    :deep(.el-dropdown-menu__item:first-of-type),
    .dropdown-item:first-of-type {
        border-top-left-radius: 12px;
    }
    &,
    :deep(.el-dropdown-menu__item:last-of-type),
    .dropdown-item:last-of-type {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
}
</style>
