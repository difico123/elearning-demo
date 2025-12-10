import { Vue } from 'vue-class-component';
import {
    AuthProvider,
    Regex,
    SystemRole,
} from './constants';
import { translateYupError } from './helpers';

export class GlobalMixin extends Vue {
    SystemRole = SystemRole;
    AuthProvider = AuthProvider;
    Regex = Regex;
    translateYupError = translateYupError;
}
