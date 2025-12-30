import * as moment from 'moment';
import { User } from 'src/modules/user/entity/user.entity';
import { EXPIRED_TOKEN_SECONDS } from './constant';
import { FilteredUser } from './interfaces';
import * as _ from 'lodash';
import { join } from 'path';
const fs = require('fs');

export const filterUser = (user: User): FilteredUser => {
  delete user.password;
  delete user.resetToken;
  delete user.expiredTokenTime;
  return user;
};

export const hasResetTokenExpired = (
  resetTokenTime: Date,
  expiredTime?: number,
) => {
  let seconds = moment().unix() - moment(resetTokenTime).unix();
  let timeExpiration = expiredTime || EXPIRED_TOKEN_SECONDS;
  return timeExpiration < seconds;
};

export const generateDigits = (numberRandom: number = 6) => {
  let baseNumber = Math.pow(10, numberRandom);
  let MaxBaseNumber = Math.pow(10, numberRandom - 1);
  return Math.floor(baseNumber + Math.random() * 9 * MaxBaseNumber);
};

export const removeExtention = (fileName: string) => {
  return (fileName && fileName?.split('.').slice(0, -1).join('.')) || fileName;
};

export const stringToMysqlTimeStamp = (yyyymmdd: string) => {
  return moment(yyyymmdd).add(1, 'day').utc().format() as unknown as Date;
};

export const mysqlToTimeStamp = (time: string | Date) => {
  return (
    (time &&
      (moment(time)
        .utc(false)
        .format('YYYY/MM/DD HH:mm:ss') as unknown as Date)) ||
    ('' as unknown as Date)
  );
};

export const timeStampToMysql = (time: string) => {
  return (
    (time && (moment(time).utc(true).format() as unknown as Date)) ||
    ('' as unknown as Date)
  );
};

export const coursePeriod = (startTime: string, endTime: string) => {
  return {
    startCourseTime: startTime && stringToMysqlTimeStamp(startTime),
    endCourseTime: endTime && stringToMysqlTimeStamp(endTime),
  };
};

export const mysqlTime = (time: Date | string) => {
  return (
    (time && (moment(time).utc().format('YYYY-MM-DD') as unknown as Date)) ||
    ('' as unknown as Date)
  );
};
export const mysqlToTime = (startTime: Date, endTime: Date) => {
  return {
    startCourseTime: mysqlTime(startTime),
    endCourseTime: mysqlTime(endTime),
  };
};

export const mysqlTimeStamp = (time: Date) => {
  return (
    (time &&
      (moment(time)
        .utc(true)
        .format('YYYY/MM/DD hh:mm:ss') as unknown as Date)) ||
    ('' as unknown as Date)
  );
};

export const defaultResponseTime = (created_at: Date, updated_at: Date) => {
  return {
    created_at: mysqlTimeStamp(created_at),
    updated_at: mysqlTimeStamp(updated_at),
  };
};

export function getPaginatedItems(
  items: any,
  page?: number,
  pageSize?: number,
) {
  let pg = page || 1,
    pgSize = pageSize || 100,
    offset = (pg - 1) * pgSize,
    pagedItems = _.drop(items, offset).slice(0, pgSize),
    showPageSize = items.length < pgSize ? items.length : pgSize;

  return {
    items: pagedItems,
    page: pg,
    pageSize: showPageSize,
    total_pages: Math.ceil(items.length / pgSize),
  };
}
type Folder = 'avatar' | 'course' | 'video';

export function removeImageFile(image: string, folder: Folder) {
  let path = join(process.cwd(), `/uploads/${folder}/${image}`);
  if (folder === 'video') {
    rmvideo(image);
  }
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

export function hasFile(path: string) {
  if (fs.existsSync(path)) {
    return true;
  }
  return false;
}

export const generateAvatar = (identify: string, _stt?: number) => {
  // Generate initials from the identifier
  // If it's an email, extract the part before @, otherwise use the identifier
  let name = identify;
  if (identify.includes('@')) {
    name = identify.split('@')[0];
  }

  // Extract initials (first 2 characters, uppercase)
  const initials = name.substring(0, 2).toUpperCase();

  // Generate a consistent color based on the identifier
  // This ensures the same user always gets the same color
  const colors = [
    '0d8abc', // Blue
    'e91e63', // Pink
    '9c27b0', // Purple
    '673ab7', // Deep Purple
    '3f51b5', // Indigo
    '2196f3', // Light Blue
    '00bcd4', // Cyan
    '009688', // Teal
    '4caf50', // Green
    '8bc34a', // Light Green
    'cddc39', // Lime
    'ffeb3b', // Yellow
    'ffc107', // Amber
    'ff9800', // Orange
    'ff5722', // Deep Orange
    '795548', // Brown
    '607d8b', // Blue Grey
    '9e9e9e', // Grey
  ];

  // Use identifier as seed for consistent color selection
  let hash = 0;
  for (let i = 0; i < identify.length; i++) {
    hash = identify.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % colors.length;
  const backgroundColor = colors[colorIndex];

  // Generate Gmail-style avatar using UI Avatars API
  // Format: https://ui-avatars.com/api/?name=Initials&background=Color&color=fff&size=128&bold=true
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    initials,
  )}&background=${backgroundColor}&color=fff&size=128&bold=true&font-size=0.5`;
};

export const rmvideo = (filename: string) => {
  let videoPath = join(
    process.cwd(),
    `/temp/chunks/${removeExtention(filename)}`,
  );

  if (fs.existsSync(videoPath)) {
    fs.rm(videoPath, { recursive: true, force: true }, (err) => {
      if (err) {
        throw err;
      }
      console.log(`${videoPath} is deleted!`);
    });
  }
};

export const getMonthText = (month: number) => {
  let monthTx = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthTx[month];
};
