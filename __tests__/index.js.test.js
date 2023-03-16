import * as gendiff from '../src/index.js';

const file1 = {
  host: 'hexlet.io',
  timeout: 50,
  proxy: '123.234.53.22',
  follow: false,
};

const file2 = {
  timeout: 20,
  verbose: true,
  host: 'hexlet.io',
};

const expectedBasic = `{
 - follow: false
   host: hexlet.io
 - proxy: 123.234.53.22
 - timeout: 50
 + timeout: 20
 + verbose: true
}`;

const expectedOneEmpty = `{
 - follow: false
 - host: hexlet.io
 - proxy: 123.234.53.22
 - timeout: 50
}`;

const path1 = '/home/boris/genDiff/__fixtures__/file1.json';
const path2 = '__fixtures__/file2.json';

describe('check File Extension', () => {
  test('checkFileExtension basic run', () => {
    expect(gendiff.checkFileExtension(path1, path2)).toEqual('JSON');
  });
});

describe('Make Filepath > Objects', () => {
  test('make Filepath Object - ABSOLUTE path', () => {
    expect(gendiff.makeFilepathObject(path1)).toEqual(file1);
  });

  test('make Filepath Object - RELATIVE path', () => {
    expect(gendiff.makeFilepathObject(path2)).toEqual(file2);
  });
});

describe('Compare function', () => {
  test('compareJSONS basic obj compare', () => {
    expect(gendiff.compareJSONS(file1, file2)).toEqual(expectedBasic);
  });

  test('compareJSONS empty obj compare', () => {
    expect(gendiff.compareJSONS({}, {})).toEqual('{}');
  });

  test('compareJSONS one empty compare', () => {
    expect(gendiff.compareJSONS(file1, {})).toEqual(expectedOneEmpty);
  });
});

describe('GenDiff - Final function', () => {
  test('Gendiff basic run', () => {
    expect(gendiff.genDiff(path1, path2)).toEqual(expectedBasic);
  });
  test('Gendiff empty path', () => {
    expect(gendiff.genDiff('', '')).toEqual('enter valid path');
  });
});
