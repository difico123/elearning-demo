import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex/index';
import { IUserData, IUserOnlineList } from '@/common/interfaces';

@Module({ dynamic: true, namespaced: true, store, name: 'user' })
class UserModule extends VuexModule {
    userData: IUserData = {};

    userOnlineList: IUserOnlineList[] = [];

    @Action
    setUserData(userData: IUserData) {
        this.SET_USER_DATA(userData || {});
    }

    @Action
    setUserOnlineList(userOnlineList: IUserOnlineList[]) {
        this.SET_USER_ONLINE(userOnlineList || []);
    }

    @Action
    setReadNotification() {
        this.SET_USER_DATA(
            {
                ...this.userData,
                unreadNotification: 0,
            } || {},
        );
    }

    @Action
    setIncreaseNotification() {
        console.log(this.userData.unreadNotification);
        this.SET_USER_DATA(
            {
                ...this.userData,
                unreadNotification: (this.userData.unreadNotification || 0) + 1,
            } || {},
        );
    }

    @Mutation
    SET_USER_DATA(userData: IUserData) {
        this.userData = userData;
    }

    @Mutation
    SET_USER_ONLINE(userOnlineList: IUserOnlineList[]) {
        this.userOnlineList = userOnlineList;
    }
}
export const userModule = getModule(UserModule);
