import { Module, VuexModule, Action, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/plugins/vuex/index';

@Module({ dynamic: true, namespaced: true, store, name: 'authRegister' })
class RegisterModule extends VuexModule {

    registerEmail = '';
    authProvider = '';
    isShowConfirmationBox = false;
    registerPhoneNumber = '';
    activeEmailToken = '';

    @Action
    setRegisterEmail(email: string) {
        this.SET_REGISTER_EMAIL(email);
    }

    @Action
    setRegisterPhoneNumber(phoneNumber: string) {
        this.SET_REGISTER_PHONE_NUMBER(phoneNumber);
    }

    @Action
    setAuthProvider(value: string) {
        this.SET_AUTH_PROVIDER(value);
    }

    @Action
    setIsShowConfirmationBox(value: boolean) {
        this.SET_IS_SHOW_CONFIRMATION_BOX(value);
    }

    @Action
    setActiveEmailToken(token: string) {
        this.SET_ACTIVE_EMAIL_TOKEN(token);
    }

    @Mutation
    SET_REGISTER_EMAIL(value: string) {
        this.registerEmail = value;
    }

    @Mutation
    SET_AUTH_PROVIDER(value: string) {
        this.authProvider = value;
    }

    @Mutation
    SET_IS_SHOW_CONFIRMATION_BOX(value: boolean) {
        this.isShowConfirmationBox = value;
    }

    @Mutation
    SET_REGISTER_PHONE_NUMBER(phoneNumber: string) {
        this.registerPhoneNumber = phoneNumber;
    }

    @Mutation
    SET_ACTIVE_EMAIL_TOKEN(token: string) {
        this.activeEmailToken = token;
    }

}
export const registerModule = getModule(RegisterModule);
