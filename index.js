"use strict";
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Use full paths for files and tarFilePath
module.exports = function archiverPack(format, files, tarFilePath, options) {
  return new Promise(function promisifyPackTgz(resolve, reject) {
    const outStream = fs.createWriteStream(tarFilePath);
    const archive = archiver(format, options);
    outStream.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(outStream);
    for (let filePath of files) {
      archive.append(fs.createReadStream(filePath), {
        name: path.basename(filePath),
      });
    }
    archive.finalize();
  });
};

