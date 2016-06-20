"use strict";

const assert = require('assert');
const ensureDirAsync = require('fs-extra-promise').ensureDirAsync;
const removeAsync = require('fs-extra-promise').removeAsync;
const fs = require('mz/fs');
const path = require('path');
const tmpdir = require('os').tmpdir();
const uuid = require('node-uuid');
const exec = require('child_process').exec;

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
    yield ensureDirAsync(testDir);
  });

  afterEach(function*() {
    yield removeAsync(testDir);
  });
  
  describe('pack several txt files', function() {
    it('should pack without errors', function*() {
      yield files.map(function* (file, i) {
        yield fs.writeFile(file, 'hello ' + i);
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

  describe('pack several txt missing files', function() {
    it('should not pack succesfully', function*() {
      const fakeFiles = [
        'fake-a.txt',
        'fake-b.txt',
      ];
      const tgzFilePath = path.join(testDir, 'foo.tar.gz');
      try {
        yield packTgz('tar', fakeFiles, tgzFilePath, {
          gzip: true,
          gzipOptions: {
            level: 1
          },
        });
      } catch (err) {
        assert.strictEqual(err.code, 'ENOENT');
        assert.strictEqual(err.path, 'fake-a.txt');
        return;
      }
      throw new Error('archive should not end succesfully');
    });
  });

  describe.only('Big files', function() {
    const files = [
      path.join(tmpdir, uuid()),
      path.join(tmpdir, uuid()),
      path.join(tmpdir, uuid()),
    ];

    function truncateBigFile(filePath) {
      return new Promise(function(resolve, reject) {
        exec('truncate -s 3G ' + filePath, function(err, stdout, stderr) {
          if (err) {
            reject(err);
          } else if (stderr) {
            reject(stderr);
          } else {
            resolve();
          }
        });
      });
    }

    beforeEach(function*() {
      this.timeout(5 * 60 * 1000);
      yield files.map(truncateBigFile);
    });

    afterEach(function*() {
      yield files.map(function(filePath) {
        return fs.unlink(filePath);
      });
    });

    it('should pack three big files', function*() {
      this.timeout(5 * 60 * 1000);
      const tgzFilePath = path.join(tmpdir, uuid() + '.tar.gz');
      yield packTgz('tar', files, tgzFilePath, {
        gzip: true,
        gzipOptions: {
          level: 1
        },
      });
      const stat = yield fs.stat(tgzFilePath);
      assert(stat.size > 1);
      yield fs.unlink(tgzFilePath);
    });

  });
});

