import momentTimezone from 'moment-timezone';
import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import cloneDeep from 'lodash/cloneDeep';
import trim from 'lodash/trim';
import { DateFormat, DEFAULT_AVATAR_COLORS } from './constants';
import moment from 'moment';

export function convertTimeToUTC(time: string | Date) {
    return momentTimezone.tz(time, 'UTC').toDate();
}

export function isEndOfDay(dateTime: string | Date, timezoneName: string) {
    const time = momentTimezone
        .tz(convertTimeToUTC(dateTime), timezoneName)
        .format(DateFormat.HH_mm_ss_COLON);
    return /23:59:59/.test(time);
}

export function isStartOfDay(dateTime: string | Date, timezoneName: string) {
    const time = momentTimezone
        .tz(convertTimeToUTC(dateTime), timezoneName)
        .format(DateFormat.HH_mm_ss_COLON);
    return /00:00:00/.test(time);
}

export function isJson(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export function parseToCamelCase(data: any) {
    const parsedData = cloneDeep(data);
    function parse(item: any) {
        mapKeys(item, function (value, key) {
            const keyInCamelCase = camelCase(key);
            if (keyInCamelCase !== key) {
                item[keyInCamelCase] = cloneDeep(item[key]);
                delete item[key];
            }
            if (isPlainObject(item[keyInCamelCase] as any)) {
                parse(item[keyInCamelCase]);
            }
            if (isArray(item[keyInCamelCase])) {
                item[keyInCamelCase].forEach((childItem: any) => parse(childItem));
            }
        });
    }
    parse(parsedData);
    return parsedData;
}

export function trimData(body: any): void {
    const trimValue = (item: any) => {
        mapKeys(item, (value, key) => {
            // remove string contain only space characters
            if (typeof value === 'string') {
                item[key] = value.trim();
            }

            // iterate array
            else if (Array.isArray(value)) {
                value.forEach((subValue, index) => {
                    // remove string contain only space characters
                    if (typeof subValue === 'string' && !trim(subValue as string)) {
                        value.splice(index, 1);
                    } else if (isPlainObject(subValue)) {
                        trimValue(subValue);
                    }
                });
            } else if (isPlainObject(value)) {
                trimValue(value);
            }
        });
    };

    trimValue(body);
}

export function removeEmptyValue(query: any): void {
    const removeEmpty = (item: any) => {
        mapKeys(item, (value, key) => {
            // remove null, undefined, empty
            if (value !== 0 && !value) {
                delete item[key];
            }
            // remove string contain only space characters
            else if (typeof value === 'string' && !trim(value as string)) {
                delete item[key];
            }

            // iterate array
            else if (isArray(value)) {
                value.forEach((property, index) => {
                    // remove null, undefined, empty
                    if (!property) {
                        value.splice(index, 1);
                    }

                    // remove string contain only space characters
                    else if (typeof property === 'string' && !trim(property as string)) {
                        value.splice(index, 1);
                    }
                });
            }
        });
    };

    removeEmpty(query);
}

export function getFirstLetterOfName(name: string) {
    const splittedName = name.split(/[ -]/);
    return splittedName[0].charAt(0).toUpperCase();
}

//hash function to generate unique hash string for each username
export function getHashOfString(name: string) {
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
        // tslint:disable-next-line: no-bitwise
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return hash;
}

export function generateDefaultAvatarColor(name: string) {
    return DEFAULT_AVATAR_COLORS[getHashOfString(name) % 6];
}

export const yyyymmddFormat = (date: Date | string) => {
    return moment(date).format('YYYY-MM-DD');
};
