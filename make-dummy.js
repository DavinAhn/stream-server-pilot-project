const axios = require('axios');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data');
const target = '3';

const paddingSize = 400000;
const paddingPath = path.join(__dirname, 'padding.dat');

const start = 1;
const end = 240;
const interval = 50;

const width = 1000;
const height = 1600;

const bgColor = 'ffffff';
const fgColor = '000000';

const donwload = (idx, max) => {
  axios.request({
    method: 'get',
    url: `https://dummyimage.com/${width}x${height}/${bgColor}/${fgColor}.jpg&text=${idx}`,
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'image/jpeg',
    },
  }).then((response) => {
    const filePath = path.join(dataPath, target, `${idx}.jpg`);
    fs.writeFileSync(filePath, response.data);
    exec(`copy /b ${filePath} + /b ${paddingPath} /b ${filePath}`);
    setTimeout(() => {
      if (idx <= max) {
        donwload(idx + 1, max);
      }
    }, interval);
  });
};

if (fs.existsSync(paddingPath)) {
  fs.unlinkSync(paddingPath);
}
exec(`fsutil file createnew ${paddingPath} ${paddingSize}`);

const targetPath = path.join(dataPath, target);
if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath);
}

donwload(start, end);
