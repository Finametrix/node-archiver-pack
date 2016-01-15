"use strict";

const fs = require('fs-extra-promise');
const path = require('path');

function stat(filePath) {
  return new Promise(function(resolve, reject) {
    fs.stat(filePath, function(err, res) {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  });
}

describe('NP pack-tgz integration tests', function() {
  const packTgz = require('../');

  const testDir = path.join(__dirname, 'tmp-data');
  const files = [ 'a.txt', 'b.txt', 'c.txt' ].map(function(fileName) {
    return path.join(testDir, fileName);
  });

  beforeEach(function*() {
    yield fs.ensureDirAsync(testDir);
  });

  afterEach(function*() {
    yield fs.removeAsync(testDir);
  });
  
  describe('pack several txt files', function() {
    it('should pack without errors', function*() {
      yield files.map(function* (file, i) {
        yield fs.outputFileAsync(file, 'hello ' + i);
      });
      const tgzFilePath = path.join(testDir, 'foo.tar.gz');
      yield packTgz('tar', files, tgzFilePath, {
        gzip: true,
        gzipOptions: {
          level: 1
        },
      });
      yield stat(tgzFilePath);
    });
  });

});

