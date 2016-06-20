"use strict";
const fs = require('mz/fs');
const path = require('path');
const archiver = require('archiver');

/**
 * @function archiverPack - archive files with node-archiver
 * @param {string} format - the archive format to use
 * @param {array} files - files (full path) to archive
 * @param {string} tarFilePath - destination (full path) archive file
 * @param {object} options - Archive CoreOptions and/or TransformOptions to use
 */
module.exports = function* archiverPack(format, files, tarFilePath, options) {
  const statsMap = new Map();
  yield files.map(function*(filePath) {
    const stats = yield fs.stat(filePath);
    statsMap.set(filePath, stats);
  });
  return new Promise(function promisifyPackTgz(resolve, reject) {
    let outStream;
    let archive;
    let inputStreams;
    try {
      inputStreams = files.map(function(filePath) {
        const stream = fs.createReadStream(filePath);
        stream.on('error', reject);
        return stream;
      });
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
        _stats: statsMap.get(filePath),
      });
    }
    archive.finalize();
  });
};

