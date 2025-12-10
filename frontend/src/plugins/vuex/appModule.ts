import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex';
import {
    DEFAULT_LANGUAGE,
    DeviceType,
    ScreenWidthBreakpoint,
    SupportLanguage,
} from '@/common/constants';
import { IUser } from '@/common/tokenService';

@Module({
    name: 'app',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AppModule extends VuexModule {
    loginUser: IUser = {} as IUser;
    screenWidth = window.innerWidth;
    currentLanguage = DEFAULT_LANGUAGE;

    get deviceType() {
        return this.screenWidth <= ScreenWidthBreakpoint.MD_BREAKPOINT
            ? DeviceType.MOBILE
            : DeviceType.DESKTOP;
    }

    get isUserLogin(): boolean {
        return !!this.loginUser?.id;
    }

    @Action
    setLoginUser(user: IUser) {
        this.SET_LOGIN_USER(user);
    }

    @Action
    setScreenWidth(screenWidth: number) {
        this.SET_SCREEN_WIDTH(screenWidth);
    }

    @Action
    setCurrentLanguage(language: SupportLanguage) {
        this.SET_CURRENT_LANGUAGE(language);
    }

    @Mutation
    SET_SCREEN_WIDTH(screenWidth: number) {
        this.screenWidth = screenWidth;
    }

    @Mutation
    SET_LOGIN_USER(user: IUser) {
        this.loginUser = user;
    }

    @Mutation
    SET_CURRENT_LANGUAGE(language: SupportLanguage) {
        this.currentLanguage = language;
    }
}

export const appModule = getModule(AppModule);
