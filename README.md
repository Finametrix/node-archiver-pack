# archiver-pack

[![Build Status](https://img.shields.io/travis/Finametrix/node-archiver-pack/master.svg)](http://travis-ci.org/Finametrix/node-archiver-pack)
[![Dependency Status](https://img.shields.io/david/Finametrix/node-archiver-pack.svg)](https://david-dm.org/Finametrix/node-archiver-pack)
[![Dev dependency Status](https://img.shields.io/david/dev/Finametrix/node-archiver-pack.svg)](https://david-dm.org/Finametrix/node-archiver-pack)

Archive files with any supported format returning a `Promise` object. It rely
in [archiver](https://github.com/archiverjs/node-archiver) for archive generation.

## Installation

```
npm install archiver-pack
```

## Usage

Better use full file paths.

```javascript
const archiverPack = require('archiver-pack');
const files = [
  '/a/b/foo',
  '/a/b/bar',
  '/a/b/xyz',
];
const tgzFile = '/a/b/backup.tar.gz';
const archiverOptions = {
  gzip: true,
  gzipOptions: {
    level: 1
  },
};
archiverPack('tar', files, tgzFile, archiverOptions).then(function() {
  console.log('tgz file generated succesfully');
});
```

## Tests

Use `npm test` to run the tests.

## Issues

If you discover a bug, please [raise an issue on Github](https://github.com/antoniobusrod/node-archiver-pack/issues). 

