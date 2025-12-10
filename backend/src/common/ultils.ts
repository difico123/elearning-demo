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

export const generateAvatar = (identify: string, stt?: number) => {
  const name = [
    'croodles',
    'micah',
    'avataaars',
    'adventurer',
    'big-smile',
    'miniavs',
    'open-peeps',
    'personas',
  ];
  const index = stt % name.length;
  const randomIndex = Math.floor(Math.random() * name.length);
  const avatarApi = (avatarName: string, id: string) =>
    `https://avatars.dicebear.com/api/${avatarName}/${id}.svg`;

  return avatarApi(name[index || randomIndex], identify);
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
