"use strict";
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

function createReadStream(filePath) {
  return fs.createReadStream(filePath);
}

/**
 * @function archiverPack - archive files with node-archiver
 * @param {string} format - the archive format to use
 * @param {array} files - files (full path) to archive
 * @param {string} tarFilePath - destination (full path) archive file
 * @param {object} options - Archive CoreOptions and/or TransformOptions to use
 */
module.exports = function archiverPack(format, files, tarFilePath, options) {
  return new Promise(function promisifyPackTgz(resolve, reject) {
    let outStream;
    let archive;
    let inputStreams;
    try {
      inputStreams = files.map(createReadStream);
      outStream = fs.createWriteStream(tarFilePath);
      archive = archiver(format, options);
    } catch (err) {
      return reject(err);
    }
    outStream.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(outStream);
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      const inputStream = inputStreams[i];
      archive.append(inputStream, {
        name: path.basename(filePath),
      });
    }
    archive.finalize();
  });
};

