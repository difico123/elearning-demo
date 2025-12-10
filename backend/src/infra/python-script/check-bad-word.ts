// The '-u' tells Python to flush every time
const { join } = require('path');
const { spawn } = require('child_process');

export const checkBadWordScript = (comment: string): Promise<boolean> => {
  let pythonExecutable = 'python3';

  let checkBadWordScriptPath = join(process.cwd(), '/py/model.py');

  const scriptExecution = spawn(pythonExecutable, [
    '-u',
    checkBadWordScriptPath,
    comment,
  ]);

  return new Promise((resolve, reject) => {
    try {
      scriptExecution.stdout.on('data', (data) => {
        let isBad = data.toString().includes('1');
        resolve(isBad);
      });

      scriptExecution.on('error', (err) => {
        throw new Error(err.message);
      });
    } catch (e) {
      reject(e);
    }
  });
};
