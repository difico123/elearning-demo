import { DEFAULT_LANGUAGE, SupportLanguage } from '@/common/constants';
import { createI18n } from 'vue-i18n';
import messages from './messages';

const i18n = createI18n({
    legacy: false,
    locale: 'vi', // set locale
    fallbackLocale: 'vi', // set fallback locale
    messages, // set locale messages
    globalInjection: true,
});

export default i18n;
