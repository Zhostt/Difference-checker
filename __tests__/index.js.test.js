import * as gendiff from '../src/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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

// Ниже мы получаем абсолютный путь в любом месте - даже в вирт окружении (нужно для тестов на гите)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path1 = path.join(__dirname, '../__fixtures__/file1.json');
const path2 = '__fixtures__/file2.json';
const path1Relative = '__fixtures__/file1.json'

describe('check File Extension', () => {
  test('checkFileExtension basic run', () => {
    expect(gendiff.checkFileExtension(path1, path2)).toEqual('JSON');
  });
});

describe('path Absolutizer', () => {
  test('path Absolutizer - relative to abs', () => {
  expect(gendiff.pathAbsolutizer(path1Relative)).toEqual(path1);
  });
  test('path Absolutizer - relative to abs', () => {
  expect(gendiff.pathAbsolutizer(path1)).toEqual(path1);
  });
});

describe('Compare function', () => {
  test('compareJSONS basic obj compare', () => {
    expect(gendiff.compareObjects(file1, file2)).toEqual(expectedBasic);
  });

  test('compareJSONS empty obj compare', () => {
    expect(gendiff.compareObjects({}, {})).toEqual('{}');
  });

  test('compareJSONS one empty compare', () => {
    expect(gendiff.compareObjects(file1, {})).toEqual(expectedOneEmpty);
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
