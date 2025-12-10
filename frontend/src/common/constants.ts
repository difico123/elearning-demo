import i18n from '@/plugins/vue-i18n';

export enum PageName {
    LOGIN_PAGE = 'LoginPage',
    REGISTER_PAGE = 'RegisterPage',
    GOOGLE_PAGE = 'GooglePage',
    LANDING_PAGE = 'LandingPage',
    NOT_FOUND_PAGE = 'NotFoundPage',
    CREATE_PASSWORD_PAGE = 'CreatePasswordPage',
    SELECT_ROLE_PAGE = 'SELECT_ROLE_PAGE',
    PENDING_APPROVE_PAGE = 'PENDING_APPROVE_PAGE',
    USER_PROFILE_PAGE = 'USER_PROFILE_PAGE',
    COURSE_LIST_PAGE = 'COURSE_LIST_PAGE',
    CREATE_COURSE_PAGE = 'CREATE_COURSE_PAGE',
    COURSE_DETAIL_PAGE = 'COURSE_DETAIL_PAGE',
    ACCEPTED_PAYMENT_PAGE = 'ACCEPTED_PAYMENT_PAGE',
    DECLINED_PAYMENT_PAGE = 'DECLINED_PAYMENT_PAGE',
    COURSE_PREVIEW_PAGE = 'COURSE_PREVIEW_PAGE',
    USER_COURSE_LIST_PAGE = 'USER_COURSE_LIST_PAGE',
    FORGOT_PASSWORD_PAGE = 'FORGOT_PASSWORD_PAGE',
    RESET_PASSWORD_PAGE = 'RESET_PASSWORD_PAGE',
}

export enum SupportLanguage {
    EN = 'en',
    VI = 'vi',
}

export enum OrderBy {
    ID = '_id',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export enum UserTokenType {
    REFRESH_TOKEN = 'refresh_token',
    ACTIVE_USER = 'active_user',
    FORGOT_PASSWORD = 'forgot_password',
    REQUEST_OTP = 'request_otp',
}
export const DEFAULT_LANGUAGE = SupportLanguage.VI;
export const TIMEZONE_HEADER = 'x-timezone';
export const TIMEZONE_NAME_HEADER = 'x-timezone-name';

export const DEFAULT_LIMIT_FOR_DROPDOWN = 1000;
export const DEFAULT_LIMIT_FOR_PAGINATION = 10;
export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_ORDER_BY = 'createdAt';
export const DEFAULT_ORDER_DIRECTION = 'desc';
export const DEFAULT_MIN_DATE = '1970-01-01 00:00:00';
export const DEFAULT_MAX_DATE = '3000-01-01 00:00:00';
export const DEFAULT_ARRAY_MAX_LENGTH = 1000;

export const INTEGER_POSITIVE_MIN_VALUE = 1;
export const INTEGER_POSITIVE_MAX_VALUE = 4294967295;
export const PAGINATION_MAX_PAGE = 10000; // max item per one page
export const PAGINATION_MAX_LIMIT = 10000; // max page value

export const Regex = {
    URI: /^https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/,
    EMAIL: /^(([a-zA-Z0-9]+)([.]{1})?)*[a-zA-Z0-9]@([a-zA-Z0-9]+[.])+[a-zA-Z0-9]+$/,
    NUMBER: /^(?:[0-9]\d*|)$/,
    OBJECT_ID: /^[0-9a-fA-F]{24}$/,
    MOBILE_NUMBER: /^[0-9]{10}$/,
    OTP: /^[0-9]{6}$/, // TODO: correct it later
    //Must contains a number and an alphabet, more than 6 characters long, can also contain special characters
    PASSWORD:
        /(?!^[0-9]*$)(?!^[a-zA-Z!@#$%^&*()_+=<>?]*$)^([a-zA-Z!@#$%^&*()_+=<>?0-9]{8,})$/,
};

export enum DateFormat {
    YYYY_MM_DD_HYPHEN = 'YYYY-MM-DD',
    HH_mm_ss_COLON = 'HH:mm:ss',
    YYYY_MM_DD_HYPHEN_HH_mm_ss_COLON = 'YYYY-MM-DD HH:mm:ss',
    HH_mm_COLON = 'HH:mm',
}

export enum ValidationForm {
    INPUT_TEXT_MAX_LENGTH = 255,
    TEXTAREA_MAX_LENGTH = 2000,
    PASSWORD_MIN_LENGTH = 6,
    PASSWORD_MAX_LENGTH = 64,
}

export enum HttpStatus {
    OK = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    INVALID_USERNAME_OR_PASSWORD = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404, // API not found
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    FAILED_DEPENDENCY = 424,
    ITEM_NOT_FOUND = 444,
    ITEM_ALREADY_EXIST = 445,
    ITEM_INVALID = 446,
    ITEM_IS_USING = 447,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
    NETWORK_ERROR = 512,
}

export enum BooleanEnum {
    TRUE = 'true',
    FALSE = 'false',
}

export enum SystemRole {
    ADMIN = 'admin',
    GUEST = 'guest',
    STUDENT = 'student',
    INSTRUCTOR = 'instructor',
    PENDING = 'pending',
}

export enum LocalStackStoragePath {
    ONLINE_CLASSES = 'online-classes',
    COURSES = 'courses',
    TEACHER_MATERIALS = 'teacher-materials',
}

export enum AuthProvider {
    EMAIL = 'email',
    MOBILE = 'mobile',
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    ZALO = 'zalo',
}

export enum UserStatus {
    REGISTERING = 'registering',
    ACTIVE = 'active',
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

export const AllowIntegerCodes = [
    // Character 0-9  in Numpad
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',
    // Character 0-9
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    // Character control
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    // Negative number
    'Minus',
];

export const AllowDecimalCodes = [
    // Character 0-9  in Numpad
    'Numpad0',
    'Numpad1',
    'Numpad2',
    'Numpad3',
    'Numpad4',
    'Numpad5',
    'Numpad6',
    'Numpad7',
    'Numpad8',
    'Numpad9',
    // Character 0-9
    'Digit0',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    // Character decimal
    'NumpadDecimal',
    'Period',
    // Character control
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    // Negative number
    'Minus',
];

export enum KeyCode {
    ENTER = 'Enter',
}

export enum DeviceType {
    MOBILE = 'mobile',
    DESKTOP = 'desktop',
}

export enum ScreenWidthBreakpoint {
    // xs: 399px,
    // sm: 575px,
    // md: 767px,
    // lg: 991px,
    // xl: 1199px,
    // xxl: 1399px,
    XS_BREAKPOINT = 399,
    SM_BREAKPOINT = 575,
    MD_BREAKPOINT = 767,
    LG_BREAKPOINT = 991,
    XL_BREAKPOINT = 1199,
    XXL_BREAKPOINT = 1399,
}

export const GenderOptions = [
    {
        name: i18n.global.t('common.gender.male'),
        id: Gender.MALE,
    },
    {
        name: i18n.global.t('common.gender.female'),
        id: Gender.FEMALE,
    },
    {
        name: i18n.global.t('common.gender.other'),
        id: Gender.OTHER,
    },
];

export const DEFAULT_AVATAR_COLORS = [
    '#5FC8A2',
    '#AA59D7',
    '#FFA800',
    '#5FA0FA',
    '#FDD443',
    '#DD2E44',
];

export const OrderDirection = {
    ASC: 'asc',
    DESC: 'desc',
};

export const IMAGE_EXTENSION_LIST = [
    'apng',
    'avif',
    'gif',
    'jpg',
    'jpeg',
    'jfif',
    'pjpeg',
    'pjp',
    'png',
    'svg',
    'webp',
];
