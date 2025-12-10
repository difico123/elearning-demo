'use strict';

import { removeExtention } from 'src/common/ultils';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const { join } = require('path');

export const generateChunkFiles = async () => {
  const relativeDest = 'temp/chunks';
  const dir = join(
    process.cwd() + `/${process.env.UPLOADED_FILES_DESTINATION}` + '/video',
  );
  const dest = join(process.cwd() + `/${relativeDest}`);
  let tempPath = join(process.cwd(), relativeDest.split('/')[0]);

  const startTime = new Date();
  console.info('> Start create chunk files', startTime);

  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
    fs.mkdirSync(dest);
  }

  if (!fs.existsSync(dir)) {
    return;
  }

  fs.readdir(dir, (readDirError, files) => {
    if (readDirError) {
      return;
    }

    const countFiles = files.length;
    files.map(async (file, index) => {
      const fileName = join(dir, file);

      let name = removeExtention(file);
      const filePath = join(dest, name);

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        let cmd = `ffmpeg -i ${fileName} -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${filePath}/video.m3u8`;

        const { err, stdout, stderr } = await exec(cmd);
        if (err) {
          console.error(err);
        }
        console.info('> created chunks files', name);
      }
      if (countFiles - 1 === index) {
        const endTime = new Date();
        console.info('< End Preparing chunk files', endTime);
      }
    });
  });
};

export const generateChunkFile = async (file: string) => {
  const relativeDest = 'temp/chunks';
  const dir = join(
    process.cwd() + `/${process.env.UPLOADED_FILES_DESTINATION}` + '/video',
  );
  const dest = join(process.cwd() + `/${relativeDest}`);

  const fileName = join(dir, file);

  let name = removeExtention(file);
  const filePath = join(dest, name);
  let cmd = `ffmpeg -i ${fileName} -profile:v baseline -level 3.0 -s 640x360 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${filePath}/video.m3u8`;

  const { err, stdout, stderr } = await exec(cmd);
  if (err) {
    console.error(err);
  }
  console.info('> created chunks files', name);
};
