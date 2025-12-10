import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex/index';
import { ICategoryData } from '../constants/landing.interfaces';

@Module({ dynamic: true, namespaced: true, store, name: 'landing' })
class LandingModule extends VuexModule {
    categoryList: Array<ICategoryData> = [];

    @Action
    setCategoryList(categoryList: Array<ICategoryData>) {
        this.SET_CATEGORY_LIST(categoryList || []);
    }

    @Mutation
    SET_CATEGORY_LIST(categoryList: Array<ICategoryData>) {
        this.categoryList = categoryList;
    }
}
export const landingModule = getModule(LandingModule);
